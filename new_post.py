#!/usr/bin/python
import sys
import argparse
import os
import subprocess
import re
import time
import requests
import json

from datetime import datetime

parser = argparse.ArgumentParser(description='Create and upload a new post')
parser.add_argument('-n','--name', help='Name for the markdown and image files', required=False, default=None)
parser.add_argument('-d','--date', help='Date of the post: YYYY-MM-DD', required=False, default=None)
parser.add_argument('-p','--path', help='Path to the actual photo to upload', required=False, default=None)
parser.add_argument('-l','--location', help='Place where the picture has been taken', required=False, default=None)

args = vars(parser.parse_args())

# Check if a date is valid and returns it with a valid format
# If empty return current date
def validateDate(date):
	if date == None:
		return None
	try:
		if date == "":
			date = time.strftime('%Y-%m-%d')
		else:
			date = datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
	except ValueError:
		date = None
	return date

# Ask for the date and return a validate string with format: YYYY-MM-DD
def getDate():
	date = validateDate(args['date'])
	while date == None:
		print "\nPlease specify a date with the format: YYYY-MM-DD"
		print "Press enter again to use current date.\n"
		date = raw_input("--> ")
		date = validateDate(date)
	return date

def getLocation():
	location = args['location']
	while location == None:
		location = getValidRawInput("Please specify some GEOLOCATION KEYWORDS:")
	return location

# Clean non-word characters and whitespaces
def clearString(s):
	# Remove all duplicated whitespaces
	s = re.sub(' +', ' ', s).strip()
	# Remove all non-word characters (everything except numbers and letters)
	s = re.sub(r"[^\w\s]", '', s).strip()
	# Replace all runs of whitespace with a single dash
	s = re.sub(r"\s", '-', s).strip()
	# If the string was empty or just containing one single whitespace then return None
	if s == '-' or s == '':
		return None
	return s

# Ask for filename NOT USED anymore.
def getFilename():
	filename = clearString(args['name'] if args['name'] != None else "")
	if filename == "":
		filename = None

	while filename == None:
		filename = getValidRawInput("Please specify a FILENAME for the markdown and image files:")
		filename = clearString(filename)
		if filename == "":
			filename = None

	return filename

# Ask for filepath. Must not contain whitespaces
def getFilepath():
	filepath = (args['path'] if args['path'] != None else "")
	stripedFilePath = re.sub(r'[\\]*', '', filepath)
	while os.path.isfile(stripedFilePath) == False:
		filepath = getValidRawInput(
			"Please enter the PATH of the image to "
			"upload:\nTip: drag'n'drop the image here.")
		stripedFilePath = re.sub(r'[\\]*', '', filepath)
		print "'" + stripedFilePath + "'"
	return filepath

# Returns an input string
def getValidRawInput(prompt):
	title = None
	while title == None:
		print "\n" + prompt + "\n"
		title = raw_input("--> ").strip()
		if title == "":
			title = None
	return title

# Create a thumbnail of the original picture within the img/thumb/ folder.
def createThumbnail(filename, filepath):
	root = os.path.dirname(os.path.realpath(__file__))
	thumbnail_path = (root + "/img/thumb/" + filename + ".jpg")
	os.system("convert -thumbnail 300 %s %s" % (filepath, thumbnail_path))

# Create a small version of the original picture within the img/large/ folder.
def createBigImage(filename, filepath):
	root = os.path.dirname(os.path.realpath(__file__))
	image_path = (root + "/img/large/" + filename + ".jpg")
	os.system("convert %s -resize 2160x1440 -quality 40 %s" % (filepath, image_path))

# Get the ratio of the new image
def getImageRatio(filename):
	root = os.path.dirname(os.path.realpath(__file__))
	thumbnail_path = (root + "/img/thumb/" + filename + ".jpg")
	command_line = "identify -format '%[fx:w/h]' " + thumbnail_path
	ratio = subprocess.check_output(command_line.split(' '))
	# Remove extra ' characters
	ratio = re.sub("'", '', ratio)
	# ratio = re.sub('\n', '', ratio)
	return ratio

# Fetch the latitude and longitude of the geolocation
def getLocationLatitudeLongitude(geolocation):
	print "\nFetching geolocation information..."
	googlemaps_api_key = "AIzaSyDQPESzmmn8Viv5TvDIKR4kEw35j5rHFXc"
	endpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=" + googlemaps_api_key
	endpoint += "&address=" + geolocation

	response = requests.get(endpoint)
	json_data = json.loads(response.text)
	location = json_data["results"][0]["geometry"]["location"]
	result = (str(location["lat"]), str(location["lng"])) 
	print result
	return result

# Create the markdown file for the new post.
def createMarkdownFile(filename, date, geolocation, title, text):
	root = os.path.dirname(os.path.realpath(__file__))
	md_path = (root + '/_posts/' + date + '-' + filename + '.markdown')
	(latitude, longitude) = getLocationLatitudeLongitude(geolocation)
	f = open(md_path,'w')
	f.write('---\nlayout: default\n') # python will convert \n to os.linesep
	f.write('date: %s\n' % date)
	f.write('photo: %s.jpg\n' % filename)
	f.write('image: /img/thumb/%s.jpg\n' % filename)
	f.write('location_text: %s\n' % geolocation)
	f.write('title: %s\n' % title)
	f.write('caption: %s\n' % text)
	f.write('location:\n')
	f.write('    latitude: %s\n' % latitude)
	f.write('    longitude: %s\n' % longitude)
	f.write('ratio: %s\n' % getImageRatio(filename))
	f.write('---\n')
	f.close() # you can omit in most cases as the destructor will call it

# Git commit new post
def gitCommitNewPost(filename, title):
	root = os.path.dirname(os.path.realpath(__file__))
	image_path = (root + "/img/large/" + filename + ".jpg")
	thumbnail_path = (root + "/img/thumb/" + filename + ".jpg")
	md_path = (root + '/_posts/' + date + '-' + filename + '.markdown')
	print "\nGit commit new post: " + title + "\n"
	os.system("cd %s" % (root))
	os.system("git add %s %s %s" % (thumbnail_path, image_path, md_path))
	os.system("git commit -m 'New post: %s'" % (title))

# Get all important data
date = getDate()
filename = "%d" % int(time.time())
print "\nNew filename: '%s'" % (filename)
filepath = getFilepath()
title = getValidRawInput("Please specify a TITLE for the new post:")
geolocation = getLocation()
text = getValidRawInput("Please specify a DESCRIPTION TEXT for the new post:")

# Create thumbnail, large image and post.
print "\nCreating new image files..."
createThumbnail(filename, filepath)
createBigImage(filename, filepath)
createMarkdownFile(filename, date, geolocation, title, text)
gitCommitNewPost(filename, title)

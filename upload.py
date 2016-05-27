#!/usr/bin/python
import sys
import argparse
import os
import subprocess
import re
import time
from datetime import datetime

parser = argparse.ArgumentParser(description='Create and upload a new post')
parser.add_argument('-n','--name', help='Name for the markdown and image files', required=False, default=None)
parser.add_argument('-d','--date', help='Date of the post: YYYY-MM-DD', required=False, default=None)
parser.add_argument('-p','--path', help='Path to the actual photo to upload', required=False, default=None)

args = vars(parser.parse_args())

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

def getDate():
	date = validateDate(args['date'])
	while date == None:
		print "\nPlease specify a date with the format: YYYY-MM-DD"
		print "Press enter again to use current date.\n"
		date = raw_input("--> ")
		date = validateDate(date)
	return date

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

def getFilepath():
	filepath = (args['path'] if args['path'] != None else "")
	while os.path.isfile(filepath) == False:
		filepath = getValidRawInput(
			"Please enter the PATH of the image to "
			"upload:\nTip: drag'n'drop the image here.")
		print "'" + filepath + "'"
		print os.path.exists(filepath)
	return filepath

def getValidRawInput(prompt):
	title = None
	while title == None:
		print "\n" + prompt + "\n"
		title = raw_input("--> ").strip()
		if title == "":
			title = None
	return title

def createThumbnail(filename, filepath):
	root = os.path.dirname(os.path.realpath(__file__))
	thumbnail_path = root + "/img/thumb/" + filename + ".jpg"
	os.system("convert -thumbnail 300 %s %s" % (filepath, thumbnail_path))

def createBigImage(filename, filepath):
	root = os.path.dirname(os.path.realpath(__file__))
	image_path = root + "/img/large/" + filename + ".jpg"
	os.system("convert %s -resize 2160x1440 -quality 40 %s" % (filepath, image_path))

def createMarkdownFile(filename, date, geolocation, title, text):
	root = os.path.dirname(os.path.realpath(__file__))
	md_path = (root + '/_posts/' + date + '-' + filename + '.markdown')
	f = open(md_path,'w')
	f.write('---\nlayout: default\n') # python will convert \n to os.linesep
	f.write('date: %s\n' % date)
	f.write('photo: %s.jpg\n' % filename)
	f.write('location: %s\n' % geolocation)
	f.write('caption_header: %s\n' % title)
	f.write('caption: %s\n' % text)
	f.write('---\n')
	f.close() # you can omit in most cases as the destructor will call it


date = getDate()
filename = getFilename()
filepath = getFilepath()
title = getValidRawInput("Please specify a TITLE for the new post:")
geolocation = getValidRawInput("Please specify some GEOLOCATION KEYWORDS:")
text = getValidRawInput("Please specify a DESCRIPTION TEXT for the new post:")

createThumbnail(filename, filepath)
createBigImage(filename, filepath)
createMarkdownFile(filename, date, geolocation, title, text)

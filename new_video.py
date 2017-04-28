#!/usr/bin/python
import sys
import argparse
import os
import subprocess
import re
import time

from datetime import datetime

parser = argparse.ArgumentParser(description='Create and upload a new video post')
parser.add_argument('-d','--date', help='Date of the post: YYYY-MM-DD', required=False, default=None)

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

# Returns an input string
def getValidRawInput(prompt):
	title = None
	while title == None:
		print "\n" + prompt + "\n"
		title = raw_input("--> ").strip()
		if title == "":
			title = None
	return title

# Create the markdown file for the new post.
def createMarkdownFile(filename, date, youtubeId, title, text, music):
	root = os.path.dirname(os.path.realpath(__file__))
	md_path = (root + '/_videos/' + date + '-' + filename + '.markdown')
	f = open(md_path,'w')
	f.write('---\nlayout: default\n') # python will convert \n to os.linesep
	f.write('date: %s\n' % date)
	f.write('youtube_id: %s\n' % youtubeId)
	f.write('title: %s\n' % title)
	f.write('caption: %s\n' % text)
	f.write('music: %s\n' % music)
	f.write('---\n')
	f.close() # you can omit in most cases as the destructor will call it

# Git commit new post
def gitCommitNewPost(filename, title, date):
	root = os.path.dirname(os.path.realpath(__file__))
	md_path = (root + '/_videos/' + date + '-' + filename + '.markdown')
	print "\nGit commit new video post: " + title + "\n"
	os.system("cd %s" % root)
	os.system("git add %s" % md_path)
	os.system("git commit -m 'New post: %s'" % title)

def createPost():
	# Get all important data
	date = getDate()
	filename = "%d" % int(time.time())
	print "\nNew filename: '%s'" % (filename)
	youtubeId = getValidRawInput("Please specify the Youtube video identifier:")
	title = getValidRawInput("Please specify a TITLE for the new video post:")
	text = getValidRawInput("Please specify a DESCRIPTION TEXT for the new video post:")
	music = getValidRawInput("Please specify the MUSIC artist and title on the video:")
	# Create markdown file
	createMarkdownFile(filename, date, youtubeId, title, text, music)
	# Git commit new file
	gitCommitNewPost(filename, title, date)

createPost()
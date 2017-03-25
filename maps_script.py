#!/usr/bin/python
# -*- coding: utf-8 -*-  
import requests
import json
import argparse
from os import listdir
from os.path import isfile, join
import re

parser = argparse.ArgumentParser(description='Update posts')
parser.add_argument('-p','--path', help='Path to the posts\' folder.', required=True, default=None)
args = vars(parser.parse_args())

path = args['path']
postfiles = [f for f in listdir(path) if isfile(join(path, f))]

def getLocationLatitudeLongitude(address):
	googlemaps_api_key = "AIzaSyD8L1sSjFveHxHM_3wxw73olaklHZukfrU"
	endpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=" + googlemaps_api_key
	endpoint += "&address=" + address

	response = requests.get(endpoint)
	json_data = json.loads(response.text)
	location = json_data["results"][0]["geometry"]["location"]
	return (str(location["lat"]), str(location["lng"]))

def removeImageEntry(filedata):
	m = re.search('image: /img/thumb/[0-9]+.jpg\n', filedata)
	if m:
		imageName = m.group(0)
		filedata = re.sub(r"image: /img/thumb/[0-9]+.jpg\n", "", filedata)
	return filedata

# Fetch the latitude and longitude of the geolocation
def getLocationLatitudeLongitude(geolocation):
	googlemaps_api_key = "AIzaSyD8L1sSjFveHxHM_3wxw73olaklHZukfrU"
	endpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=" + googlemaps_api_key
	endpoint += "&address=" + geolocation

	response = requests.get(endpoint)
	json_data = json.loads(response.text)
	location = json_data["results"][0]["geometry"]["location"]
	return (str(location["lat"]), str(location["lng"]))

def updateLocationGeometry(filedata):
	# if location has already been set do not change it.
	m = re.search('location:', filedata)
	if m:
		return None

	m = re.search('location_text:.*\n', filedata)
	if m:
		location_address = re.sub('location_text: ', '', m.group(0))
		(latitude, longitude) = getLocationLatitudeLongitude(location_address)
		print(location_address)
		filedata = re.sub(r"---[\n]*$",  "location:\n    latitude: " + latitude + "\n    longitude: " + longitude + "\n---\n", filedata)
		print(filedata)
		return filedata
	return None

for file in postfiles:

	if file == '.DS_Store':
		continue

	filePath = path + '/' + file
	
	# Read in the file
	with open(filePath, 'r') as file:
	  filedata = file.read()

	#filedata = removeImageEntry(filedata)
	filedata = updateLocationGeometry(filedata)

	if filedata != None:
		# Write the file out again
		with open(filePath, 'w') as file:
	  		file.write(filedata)
	  		print("Processed file: " + filePath)

# [picturemy.world](http://picturemy.world)

## Create a new post

Execute the following python script to create a new post:

```
$> ./new_post.py
```

**Dependency**: [imagemagick](http://www.imagemagick.org/script/index.php) is required to resize and convert the picture to jpg.

## How to _manually_ create a new post

1. Place a large image in `/img/large/`
2. Place a thumbnail version of the same image in `/img/thumb/`. _Remember to use the same file name_
3. Create a new markdown file in the `/_posts/` folder (example below).
4. Git commit and push.

```txt
---
layout: 		default
date:   		2014-04-06
photo: 			1473364600.jpg
ratio:			1.33333
location_text: 	Photo location
title: 			Sample title header
caption: 		Sample caption / description text
image: 			/img/thumb/1473364600.jpg
location:
    latitude: 43.4831519
    longitude: -1.558626
---
```

## Local environment

To start or reboot the server on your local machine, run the following script:

```
$> ./reboot.sh
```

And test your changes on:

http://127.0.0.1:4000/

If the images do not load, update the base url in the `_config.yml` file to `url: http://127.0.0.1:4000/`.

## Links

- [FontAwesome icons](http://fontawesome.io/)
- Jekyll theme based on [Blueprint: Google Grid Gallery](http://tympanus.net/codrops/?p=18699)
- Original live demo: http://tympanus.net/Blueprints/GridGallery/
- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- http://www.emoji-cheat-sheet.com/
- http://nadjetey.github.io/GridGallery/
- [Jekyll documentation](http://jekyllrb.com/)
- Interesting grid: http://tympanus.net/Blueprints/FilterableProductGrid/
- Date formatting http://alanwsmith.com/jekyll-liquid-date-formatting-examples

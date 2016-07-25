# [picturemy.world](http://picturemy.world)

## Create a new post

Execute the following python script to create a new post:

```
$> ./new_post.py
```

**Dependency**: [imagemagick](http://www.imagemagick.org/script/index.php) is required to resize and convert the picture to jpg.

## How to _manually_ use

1. Place a large image in `/img/large/`
2. Place a thumbnail version of the same image in `/img/thumb/`. _Remember to use the same file name_
3. Construction a post to display the image. Use the follow as an example:
```txt
---
layout: 	default
date:   	2014-04-06 23:26:12
photo: 		1.png
location: 	Photo location
caption_header: Sample header
caption: 	Sample caption
---
```

4. And finally, serve Jekyll source as you would normally.

## Local environment

To reboot on a local machine:

```
$> ./reboot.sh
```

And test using:

http://127.0.0.1:4000/

If the images do not load, update the base url in the `_config.yml` file to `url:http://127.0.0.1:4000/`.

## Links

- [FontAwesome icons](http://fontawesome.io/)
- Jekyll theme based on [Blueprint: Google Grid Gallery](http://tympanus.net/codrops/?p=18699)
- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- http://www.emoji-cheat-sheet.com/
- http://nadjetey.github.io/GridGallery/
- [Jekyll documentation](http://jekyllrb.com/)
- Interesting grid: http://tympanus.net/Blueprints/FilterableProductGrid/
- Date formatting http://alanwsmith.com/jekyll-liquid-date-formatting-examples

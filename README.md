# [picturemy.world](picturemy.world)

## Upload a new post

Execute the upload pythin script:

```
$> ./upload.py
```

## How to _manually_ use
1. Place a large image in `/img/large/`
2. Place a thumbnail version of the same image in `/img/thumb/`. _Remember to use the same file name_
3. Construction a post to display the image. Use the follow as an example:
```txt
---
layout: default
date:   2014-04-06 23:26:12
photo: 1.png
caption_header: Sample header
caption: sample caption
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

## Links

- [FontAwesome icons](http://fontawesome.io/)
- Jekyll theme based on [Blueprint: Google Grid Gallery](http://tympanus.net/codrops/?p=18699)
- https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- http://www.emoji-cheat-sheet.com/
- http://nadjetey.github.io/GridGallery/
- [Jekyll documentation](http://jekyllrb.com/)
- Interesting grid: http://tympanus.net/Blueprints/FilterableProductGrid/
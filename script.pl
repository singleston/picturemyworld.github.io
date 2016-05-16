#!/bin/bash
FILES="$@"
for i in $FILES
do
echo "Prcoessing image $i ..."
convert -thumbnail 300 $i thumb.$i
done

# convert waterfall.jpg -resize 2160x1440 -quality 40 waterfall.jpg

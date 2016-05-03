#!/bin/bash
FILES="$@"
for i in $FILES
do
echo "Prcoessing image $i ..."
convert -thumbnail 300 $i thumb.$i
done

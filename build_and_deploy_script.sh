#!/bin/bash

ng build --configuration production
# cd ./dist/sandwriter
# tar -czf sandwriter.tar.gz ./sandwriter
# scp ./sandwriter.tar.gz root@139.162.175.250:/var/www/html/sandwriter_frontend/sandwriter/
rsync -auvh  ./dist/forest_fire_simulation/ root@139.162.175.250:/var/www/html/forest_fire_simulation/
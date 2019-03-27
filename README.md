# HKU-7507-Visual-Analysis

## Visual Analysis of influential films’ composition

Term Project for **COMP7507 Visualization and Visual Analytics**.

## Website

[homepage](https://alextk2012.github.io/HKU-7507-Visual-Analysis/)

## Project Documents

[Proposal](https://docs.google.com/document/d/14E9eWycF5MX0oKUyZwmJY-5fs4PPzBHffhbfNvNlxcU/edit)

## Developers

- [@MaureenLmy](https://github.com/MaureenLmy)
- [@lexkaing](https://alextk2012.github.io)
- [@wonderjeo](https://github.com/wonderjeo)
- [@nottellya](https://github.com/nottellya)

## Origin Data

[TMDB 5000 Movie Dataset](https://www.kaggle.com/tmdb/tmdb-movie-metadata/version/2)

- tmdb_5000_credits.csv : 4803*4, Movie and credits datatsets, including cast and crew list

- tmdb_5000_movies.csv : 4803*20, Movie datasets

## Process Data

- tmdb_top100_data.csv : 100*25, Top 100 movie datasets. Movies Header(20) + Score + Credits Header(4)

- human_data.json : All cast and director data: {id,name,job,gender}

## Run

python3 -m http.server

visit [website](http://localhost:8000)
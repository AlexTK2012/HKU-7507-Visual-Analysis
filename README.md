# HKU-7507-Visual-Analysis

## Visual Analysis of influential films’ composition

Term Project for **COMP7507 Visualization and Visual Analytics**.

## Environment

[![jquery](https://img.shields.io/badge/Jquery-v3.3.1-green.svg)](https://jquery.com)
[![echart](https://img.shields.io/badge/Echart-v4.2.1-green.svg)](http://echartsjs.com/)
[![d3](https://img.shields.io/badge/D3-v3.5.17-green.svg)](https://d3js.org)
[![vis](https://img.shields.io/badge/Vis-v4.21.0-green.svg)](http://visjs.org)
[![bootstrap](https://img.shields.io/badge/Bootstrap-v3.4.0-green.svg)](https://getbootstrap.com)

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

Calculate movies' score=0.5 * revenue + 0.5 * vote_average

- tmdb_top100_data.csv : 100*25, Top 100 movie datasets. Movies Header(20) + Score + Credits Header(4)

- human_data.json : All cast and director data: {id,name,job,gender}

## Run

``` python
python3 -m http.server
```

visit [website](http://localhost:8000)

## Dependencies

[Exploring Movie Data with Interactive Visualizations](https://towardsdatascience.com/exploring-movie-data-with-interactive-visualizations-c22e8ce5f663)
[Tableau](http://tableau.com/)
[Bootstrap_carousel](https://www.w3schools.com/bootstrap/bootstrap_carousel.asp)
[Network](http://visjs.org/docs/network/)
[radar chart](https://www.visualcinnamon.com/2015/10/different-look-d3-radar-chart.html)

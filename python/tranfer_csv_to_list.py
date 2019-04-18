#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
将csv 转成 list
"""
import json
import pandas as pd
import numpy as np

path = "./data/6D.csv"
pathWrite = "./tmp/result_top100_heatmap_normalize.txt"

fileRead = open(path, "r+")
fileWrite = open(pathWrite,'w')

for line in fileRead.readlines():                 #依次读取每行  
    tmp = ''
    for word in line.strip().split(","):
        tmp += '"' + word.replace('"','\'') + '",'
    print ("[" + tmp[:-1] + "],")    
    fileWrite.writelines("[" + tmp[:-1] + "],")
 
# 关闭文件
fileRead.close()
fileWrite.close()



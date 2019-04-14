#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算cast经验值
"""

import json
import pandas as pd
import numpy as np


# 写json 文件
def write_json(path, data):
    # Writing JSON data
    with open(path, 'w') as f:
        json.dump(data, f)


# 加载top100 原始数据
df = pd.read_csv("./data/tmdb_top100_data.csv")
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算前100 movie 数据的最后结果，保存为csv 文件.
格式:
movie id,score(影响力),actor experience(合作人数*平均票房),director ability(雷达图sum),director experience(合作人数*平均票房),
company(第一个公司的总票房),genre(票房/评分),budget,runtime(根据散点图划分区间，计算每个区间X值),time(划分淡季旺季)

"""

import json
import pandas as pd
import numpy as np

# 加载movies 表


def load_tmdb_movies(path):
    df = pd.read_csv(path)
    return df


# 加载credits 表
def load_tmdb_credits(path):
    df = pd.read_csv(path)
    return df


# 写json 文件
def write_json(path, data):
    # Writing JSON data
    with open(path, 'w') as f:
        json.dump(data, f)


# 写入csv
def write_csv(path, dataframe):
    dataframe.to_csv(path, index=False, sep=',')


# 加载top100 原始数据
df = load_tmdb_movies("./data/tmdb_top100_data.csv")

print("len : ", len(df))

# movie_id,score,actor_experience,director_ability,director_experience,company,genre,budget,runtime,time
result = pd.DataFrame()
result['movie_id'] = df['id']
result['score'] = df['score']
result['actor_experience'] = 0
result['director_ability'] = 0
result['director_experience'] = 0
result['company'] = 0
result['genre'] = 0
result['budget'] = df['budget']
result['runtime'] = 0
result['time'] = 0

print("result : ", len(result))



# 保存结果csv
write_csv("./data/result_top100_heatmap.csv", result)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算前100 movie 数据
规则:
筛选出 revenue > 100 & vote_count > 100 的数据,
将 revenue 按 Min-Max Normalization 为 R,
vote_average 按 Min-Max Normalization 为 V, 
计算rate = 0.5*R + 0.5*V,
等到降序的top100 电影数据, 保存为csv 文件.

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
    dataframe.to_csv(path,index=False,sep=',')


df = load_tmdb_movies("./data/tmdb_5000_movies.csv")

# 清洗数据
# 筛选出 revenue > 100 & vote_count > 100 的数据
print (len(df))
df = df[(df['revenue']>100)&(df['vote_count']>100)]
print ("after clean: ",len(df))

# Min-Max Normalization 归一化
R = df['revenue'].apply(lambda x: (x - df.revenue.min()) / (df.revenue.max() - df.revenue.min()))
V = df['vote_average'].apply(lambda x: (x - df.vote_average.min()) / (df.vote_average.max() - df.vote_average.min()))

# 计算得分
df['score'] = 0.5*R + 0.5*V

# 排序, ascending=False 降序, inplace=True 替换排序前的dataframe
df.sort_values(by=['score'],ascending=False, inplace=True)

# 取 top100 数据, iloc: 通过行号获取行数据; loc: 通过行标签索引行数据.
top100_data = df.iloc[0:100]

# movie_credits 数据
credit_data = load_tmdb_movies("./data/tmdb_5000_credits.csv")

# 根据id 做 左关联. 因为top100_data 的索引未变, 因此用merge 而不是join (虽然join 也行)
result = pd.merge(top100_data,credit_data,left_on='id', right_on='movie_id',how='left')

# 保存结果csv
write_csv("./data/tmdb_top100_data.csv", result)
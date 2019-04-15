#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算前100 movie 数据的最后结果，保存为csv 文件.
格式:
movie id,score(影响力),actor experience(合作人数*平均票房),director ability(雷达图sum),director experience(合作人数*平均票房),
company(第一个公司的总票房),genre(票房/评分),budget,runtime(根据散点图划分区间，计算每个区间X值),month(划分淡季旺季)

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

print("len : ", len(df))

# movie_id,movie_title,score,actor_experience,director_ability,director_experience,company,genre,budget,runtime,month
result = pd.DataFrame()
result['movie_id'] = df['id']
result['movie_title'] = df['title_x']
result['score'] = df['score']
result['actor_experience'] = 0
result['director_ability'] = 0
result['director_experience'] = 0
result['company'] = 0
result['genre'] = 0
result['budget'] = df['budget']
result['runtime'] = 0
result['month'] = 0

print("result : ", len(result))


# 加载 month 规则，淡季旺季
def loadMonth():
    m_df = pd.read_csv("./data/rule_release_month.csv")
    # for x in df.iloc[0:100]:
    #     print (x['release_date'])
    result['month'] = df['release_date'].apply(
        lambda x: m_df[m_df['Month'] == int(x.split('-')[1])]['Rate'].iloc[0])


loadMonth()
print("loadMonth")

# 加载 actor_experience & director_experience


def loadCastExperience():
    e_df = pd.read_csv("./data/rule_cast_experience.csv")
    result['actor_experience'] = df['id'].apply(
        lambda x: e_df[e_df['movie_id'] == x]['actor_experience'].iloc[0])
    result['director_experience'] = df['id'].apply(
        lambda x: e_df[e_df['movie_id'] == x]['director_experience'].iloc[0])


loadCastExperience()
print("loadCastExperience")

# 加载 director ability & company


def loadCompany():
    c_df = pd.read_csv("./data/rule_company&director_X.csv")
    result['director_ability'] = df['id'].apply(
        lambda x: c_df[c_df['id'] == x]['Director_X'].iloc[0])
    result['company'] = df['id'].apply(
        lambda x: c_df[c_df['id'] == x]['Company_X'].iloc[0])


loadCompany()
print("loadCompany")


# 定义归一化函数 (归到[0:10])
def max_min_scaler(x, threshold_max=-1):
    if threshold_max != -1:
        # 设置阀值上限
        x = x.apply(lambda t: min(t, threshold_max))
    return (x-np.min(x))/(np.max(x)-np.min(x))*10


# 一个个处理
new_result = pd.DataFrame()
new_result['movie_id'] = result['movie_id']
new_result['movie_title'] = result['movie_title']
# 得分已经是归一化的
new_result['score'] = round(result['score'].apply(lambda x: x*10), 2)
new_result['actor_experience'] = round(result[['actor_experience']].apply(max_min_scaler), 2)
# 导演能力值，设置原数据阀值上限3.
new_result['director_ability'] = round(result[['director_ability']].apply(lambda x: max_min_scaler(x, 3)), 2)
new_result['director_experience'] = round(result[['director_experience']].apply(max_min_scaler), 2)
# 公司能力值，设置原数据阀值上限0.5.
new_result['company'] = round(result[['company']].apply(lambda x: max_min_scaler(x, 0.5)), 2)
new_result['genre'] = 0
new_result['budget'] = round(result[['budget']].apply(max_min_scaler), 2)
new_result['runtime'] = 0
new_result['month'] = result[['month']].apply(max_min_scaler)

# 保存结果csv & 归一化后的结果
# result.to_csv("./data/result_top100_heatmap.csv", index=False, sep=',')
new_result.to_csv("./data/result_top100_heatmap_normalize.csv",
                  index=False, sep=',')

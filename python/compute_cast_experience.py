#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算cast经验值
"""

import json
import pandas as pd
import numpy as np

def load_json(path):
    with open(path, 'r') as load_f:
        load_dict = json.load(load_f)
        return load_dict
    
# 加载top100 cast json信息,转成csv
def initCastFromJson():
    cast = load_json("./tmp/network_echart_main_actor.json")
    df = pd.DataFrame()
    # df = df.rename(columns={'cast_id': 'person'})
    for x in cast['nodes']:
        # "symbolSize" = int(4 + node_matrix[i]*2)
        df_tmp = pd.DataFrame({'cast_id':[x['id']],'name':[x['name']],'person':[int((x['symbolSize'] - 4)/2)],'job':[x['job']]})
        df = df.append(df_tmp)
    # df.to_csv("./tmp/top100_cast_experience.csv",index=False, sep=',')
    return df

# 加载 cast 表，cast_id,person,job
cast_df = initCastFromJson()
# cast_df = pd.read_csv("./tmp/top100_cast_experience.csv")


# 返回第一个演员id
def findFirstActorId(json):
    return json[0]['id']

# 返回第一个导演id
def findFirstDirectorId(json):
    for x in json:
        if x['job'] == 'Director':
            return x['id']


# 加载top100 原始数据--需要获取合作票房
df = pd.read_csv("./data/tmdb_top100_data.csv")

result = pd.DataFrame()
result['movie_id'] = df['id']
result['movie_title'] = df['title_x']
result['revenue'] = df['revenue']
result['actor_id'] = df['cast'].apply(lambda x : findFirstActorId(json.loads(x)))
result['director_id'] = df['crew'].apply(lambda x : findFirstDirectorId(json.loads(x)))

print (len(result))

# 返回cast 收入
def getRevenue(x):
    tmp_actor_revenue = result[result['actor_id']==x['cast_id']]['revenue'].sum()
    tmp_director_revenue = result[result['director_id']==x['cast_id']]['revenue'].sum()
    if tmp_actor_revenue > 0 and tmp_director_revenue > 0:
        print ("这个人 ",x['name'],"既有主演的收入 : ",tmp_actor_revenue," ,也有主导演的收入 : ",tmp_director_revenue)
    # elif tmp_actor_revenue <= 0 and tmp_director_revenue <= 0:
    #     # 此情况是因为人(节点)取得是前两个主演，但计算电影(主表)的演员经验时只采用第一个主演，故对于第二个主演可能会没有统计到收入（正常）
    #     print ("这个人 ",x['name']," 没有统计到收入")
    if x['job']=='Actor':
        return tmp_actor_revenue
    else :
        return tmp_director_revenue


# 返回cast 参演movie数
def getMovieNum(x):
    if x['job']=='Actor':
        return len(result[result['actor_id']==x['cast_id']])
    else :
        return len(result[result['director_id']==x['cast_id']])

# 计算cast 的总收入&出演次数
# N*M 的dataframe，使用 apply 注意指定 axis，默认是列遍历（此处需要改为行遍历）
cast_df['revenue_sum'] = cast_df.apply(lambda x : getRevenue(x), axis=1)
cast_df['movie_num'] = cast_df.apply(lambda x : getMovieNum(x), axis=1)

# 计算平均票房
def getAvrRevenue(x):
    if x['movie_num']==0:
        return 0
    else:
        return x['revenue_sum'] / x['movie_num']

# 平均票房 = 总收入 / 出演电影数
cast_df['avr_revenue'] = cast_df.apply(lambda x : getAvrRevenue(x), axis=1)


# cast 经验 = 合作人数*平均票房
cast_df['experience'] = cast_df.apply(lambda x : (x['person'] * x['avr_revenue']), axis=1)

# 保存 cast 表
cast_df.to_csv("./tmp/top100_cast_experience.csv",index=False, sep=',')


# 选取cast experience
result['actor_experience'] = result['actor_id'].apply(lambda x : cast_df[cast_df['cast_id']==x]['experience'])
result['director_experience'] = result['director_id'].apply(lambda x : cast_df[cast_df['cast_id']==x]['experience'])

# 存储result
result.to_csv("./data/rule_cast_experience.csv",index=False, sep=',')
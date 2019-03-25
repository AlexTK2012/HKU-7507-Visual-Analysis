#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
movies表字段：
budget,genres,homepage,id,keywords,original_language,original_title,overview,popularity,production_companies,production_countries,release_date,revenue,runtime,spoken_languages,status,tagline,title,vote_average,vote_count

credits表字段：
movie_id,title,cast,crew

Goal:生成导演和演员的关系, 构建邻接表
[
{id:目测导演、演员的id是唯一的
name:
job: 区分director | cast
relation:[{id(人id):value(合作次数)},{id:value}]
}
,{...}]
"""

import json
import pandas as pd

# 加载movies 表
def load_tmdb_movies(path):
    df = pd.read_csv(path)
    return df

# 加载credits 表
def load_tmdb_credits(path):
    df = pd.read_csv(path)
    json_columns = ['cast', 'crew']
    for column in json_columns:
        df[column] = df[column].apply(json.loads)
    return df

# 去重 list中元素为字典的且字典部分key相同的list元素
def remove_duplicate(dict_list):
    seen = set()
    new_dict_list = []
    for dict in dict_list : 
        # 只根据 id 去重,不考虑一个人会有多个角色的场景
        t_dict = {'id':dict['id']}
        tmp = tuple(t_dict.items())
        if tmp not in seen:
            seen.add(tmp)
            new_dict_list.append(dict)
    return new_dict_list

# 保存 human 数据 {id:1,name:Tom,job:actor,gender:1}
def save_human_data(dataframe):
    data = []

    # 逐行检测:movie_id,title,cast,crew
    for index,row in dataframe.iterrows() :

        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast : 
            item = {'id':cast['id'],'name':cast['name'],'job':'actor','gender':cast['gender']}
            data.append(item)

        # 遍历 crew 数据:credit_id,department,gender,id,job,name
        director_number = 0
        for crew in row.crew :
            if crew['job'] == 'Director' :
                director_number +=1
                item = {'id':crew['id'],'name':crew['name'],'job':'Director','gender':crew['gender']}
                data.append(item)

        # 一部电影不止一个 or 没有 Director : 确实有不少奇怪的数据
        # if director_number != 1 : 
        #     print ("movie id:",row.movie_id," ,title:",row.title," ,director_num:",director_number)

    # 去重
    print (len(data))
    data = remove_duplicate(data)
    print (len(data))

    # Writing JSON data
    with open('./data/human_data.json', 'w') as f:
        json.dump(data, f)

# 保存邻接表
def save_adjacency_data(dataframe):
# 逐行检测:movie_id,title,cast,crew
# for index,row in credits.iterrows() :
#     # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
#     for cast in row.cast : 
#         print ("id:",cast['id']," ,name:",cast['name'])
    
#     # 遍历 crew 数据:credit_id,department,gender,id,job,name
#     director_number = 0
#     for crew in row.crew :
#         if crew['job'] == 'Director' :
#             director_number +=1
#             director_tmp = dict(id=crew['id'],name=crew['name'])
    return 



credits = load_tmdb_credits("./data/tmdb_5000_credits.csv")
save_human_data(credits)
save_adjacency_data(credits)
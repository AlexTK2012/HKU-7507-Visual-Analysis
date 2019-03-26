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
import numpy as np

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


# 写文件
def write_data(path, data):
    # Writing JSON data
    with open(path, 'w') as f:
        json.dump(data, f)


# 去重 list中元素为字典的且字典部分key相同的list元素
def remove_duplicate(dict_list):
    seen = set()
    new_dict_list = []
    for dict in dict_list:
        # 只根据 id 去重,不考虑一个人会有多个角色的场景
        # {'id': 76595, 'name': 'Byron Howard', 'job': 'Director', 'gender': 2}
        if dict['id'] == 76595:
            print ("exception dict", dict)
        t_dict = {'id': dict['id']}
        tmp = tuple(t_dict.items())
        if tmp not in seen:
            seen.add(tmp)
            new_dict_list.append(dict)
    return new_dict_list


# 计算 human 数据 {id:1,name:Tom,job:actor,gender:1}
def compute_human_data(dataframe):
    data = []
    count = 0
    # 逐行检测:movie_id,title,cast,crew
    for index, row in dataframe.iterrows():
        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            data.append(item)

        # 遍历 crew 数据:credit_id,department,gender,id,job,name
        director_number = 0
        for crew in row.crew:
            if crew['job'] == 'Director':
                director_number += 1
                item = {'id': crew['id'], 'name': crew['name'],
                        'job': 'Director', 'gender': crew['gender']}
                data.append(item)

        # 一部电影不止一个 or 没有 Director : 确实有不少奇怪的数据
        if director_number != 1:
            # print ("movie id:",row.movie_id," ,title:",row.title," ,director_num:",director_number)
            count += 1
    
    # 导演数!=1 的电影数量
    print(count)
    
    # 对 human_data 去重
    print("before distinct: ",len(data))
    data = remove_duplicate(data)
    # 去重后, 总计 56603 人
    print("total: ",len(data))    
    # python lambda 表达式,计算导演数:2151人
    print("Director num:",len(list(x for x in data if x['job'] == 'Director')))
    # 等同于
    # print("Director num:",len(list(filter(lambda x: x['job'] == 'Director', data))))
    return data


# 方案1，计算邻接表
def compute_adjacency_data(dataframe):
    adjacency_data = []
    # 逐行检测:movie_id,title,cast,crew
    for index,row in dataframe.iterrows() :
        data = []
        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            data.append(item)
        
        # 遍历 crew 数据:credit_id,department,gender,id,job,name
        director_number = 0
        for crew in row.crew:
            if crew['job'] == 'Director':
                director_number += 1
                item = {'id': crew['id'], 'name': crew['name'],
                        'job': 'Director', 'gender': crew['gender']}
                data.append(item)
    
        # 遍历行数据中的所有人
        for node in data:
            node_edge = dict()
            # 构建 node 的所有边
            for node_next in data : 
                if node_next['id'] != node['id']:
                    # 默认 node 与 node_next 边值为1
                    node_edge[node_next['id']] = 1
                    # TODO
    
    return adjacency_data

# 方法2
# 构建N*N 的二维数组 node_matrix,N=len(human_data), 
# 对 x!=y, node_matrix[x,y] = x和y 两人共事过的电影数
def compute_matrix(dataframe):
    node_matrix = np.zeros((len(human_data), len(human_data)), dtype=np.int)
    # 逐行检测:movie_id,title,cast,crew
    for index,row in dataframe.iterrows() :
        # data 保存这部电影中出现过的演员+导演 对应human_data 的序号索引(下标)
        data = []

        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            tmp = human_data.index(item)
            # 理论上,同一部电影里,不会有两个一样的人:演员、导演的index不会相同
            if tmp in data:
                print ("exception ! ")
            else:
                data.append(tmp)
        
        # 遍历 crew 数据:credit_id,department,gender,id,job,name
        director_number = 0
        for crew in row.crew:
            if crew['job'] == 'Director':
                director_number += 1
                item = {'id': crew['id'], 'name': crew['name'],
                        'job': 'Director', 'gender': crew['gender']}
                tmp = human_data.index(item)
                if tmp in data:
                    print ("exception ! ")
                else:
                    data.append(tmp)

        # 遍历行数据中的所有人
        for x in data:
            # 构建 node 的所有边
            for y in data: 
                if x != y:
                    # 对于 x!=y, 说明x 与 y 共事次数+1
                    node_matrix[x][y] += 1

    return node_matrix


credits = load_tmdb_credits("./data/tmdb_5000_credits.csv")

human_data = compute_human_data(credits)
# write_data("./data/human_data.json", human_data)

# adjacency_data = compute_adjacency_data(credits)
node_matrix = compute_matrix(credits)
# write_data("./data/adjacency_data.json", adjacency_data)
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
        # 只根据 id 去重,不考虑一个人会有多个角色的场景。相同id 的数据,只保留先出现的。
        # {'id': 76595, 'name': 'Byron Howard', 'job': 'Director', 'gender': 2}
        # if dict['id'] == 76595:
        #     print ("exception dict", dict)
        t_dict = {'id': dict['id']}
        tmp = tuple(t_dict.items())
        if tmp not in seen:
            seen.add(tmp)
            new_dict_list.append(dict)
    return new_dict_list


# 计算 human 数据 {id:1,name:Tom,job:actor,gender:1}
# 全部数据:
# 导演数!=1 的电影数量：338
# 去重后, 演员+导演 总计 56603 人, 导演 2151人
#
# top100数据:
# 去重后, 演员+导演 总计 4485人, 导演 47人
def compute_human_data(dataframe):
    data = []
    count = 0
    # 逐行检测:movie_id,title,cast,crew
    for index, row in dataframe.iterrows():
        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            # James Cameron 既是actor也是director
            # if (cast['id'] == 2710):
            #     print ("Exception data :",cast['name'])

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
    
    print ("导演数!=1 的电影数量 :",count)
    # 对 human_data 去重
    print("去重前, 演员+导演 总计人数: ",len(data))
    data = remove_duplicate(data)
    # 人数还是多，感觉还要进一步筛选
    print("去重后, 演员+导演 总计人数: ",len(data))    
    # python lambda 表达式
    print("导演数量 :",len(list(x for x in data if x['job'] == 'Director')))
    # 等同于
    # print("Director num:",len(list(filter(lambda x: x['job'] == 'Director', data))))
    return data


# 方案1，计算邻接表--只要top100电影,直接方案2了
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
def compute_matrix(dataframe, nodes):
    # edge_matrix 保存边矩阵, edge_matrix[x][y] 代表xy两人共事次数。
    edge_matrix = np.zeros((len(nodes), len(nodes)), dtype=np.int)
    # node_matrix 保存点矩阵, node_matrix[x] 代表x人与node_matrix[x] 人共事过。
    node_matrix = np.zeros(len(nodes), dtype=np.int)
    
    # 逐行检测:movie_id,title,cast,crew
    for index,row in dataframe.iterrows() :
        # data 保存这部电影中出现过的演员+导演 对应human_data 的序号索引(下标)
        data = []

        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            try:
                # 根据item 去human_data中查询index,可能出现某人在human_data 中存的是director,此处确实actor角色,导致查不到,此类数据忽略
                tmp = nodes.index(item)
            except ValueError:
                tmp = -1

            # (tmp not in data):
            # 同一部电影里,有演员数据因为character不同而出现多次(大部分是配音角色不同)
            # 数据量很小,此处对重复数据做忽略处理.
            # (tmp != -1):
            # 忽略未在human_node中找到的数据(大多是因为id 相同，compute_human_data中被去重掉了)
            if (tmp not in data) and (tmp != -1):
                data.append(tmp)
        
        # 遍历 crew 数据:credit_id,department,gender,id,job,name
        director_number = 0
        for crew in row.crew:
            if crew['job'] == 'Director':
                director_number += 1
                item = {'id': crew['id'], 'name': crew['name'],
                        'job': 'Director', 'gender': crew['gender']}
                try:
                    tmp = nodes.index(item)
                except ValueError:
                    tmp = -1
                    
                if (tmp not in data) and (tmp != -1):
                    data.append(tmp)

        # 遍历行数据中的所有人
        for x in data:
            # 构建 node 的所有边
            for y in data: 
                if x != y:
                    # 对于 x!=y, 说明x 与 y 共事次数+1
                    edge_matrix[x][y] += 1
                    node_matrix[x] += 1

    # node_matrix = edge_matrix 列元素之和，或edge_matrix 行元素之和

    print ("任意两人共事数大于1的情况次数: ", len(edge_matrix[edge_matrix>1]))
    print ("任意两人共事数的最大次数: ", edge_matrix.max())
    print (np.where(node_matrix==node_matrix.max())[0][0], "号, 与最多人共事过: ", node_matrix.max())

    return edge_matrix, node_matrix

# 全部数据
# credits = load_tmdb_credits("./data/tmdb_5000_credits.csv")
# top100 电影
# credits = load_tmdb_credits("./data/tmdb_top100_data.csv")
# credits = load_tmdb_credits("./tmp/tmdb_top50_data.csv")
credits = load_tmdb_credits("./tmp/tmdb_top30_data.csv")

human_data = compute_human_data(credits)
# write_data("./data/human_data.json", human_data)

# adjacency_data = compute_adjacency_data(credits)
result_edge, result_node = compute_matrix(credits,human_data)

# 保存top100 的分析数据
# write_data("./json/top100_human_data.json", human_data)
# np.savetxt("./json/top100_edge.csv", result_edge, fmt="%d", delimiter=",") 
# np.savetxt("./json/top100_node.csv", result_node, fmt="%d", delimiter=",") 



# write_data("./data/adjacency_data.json", adjacency_data)
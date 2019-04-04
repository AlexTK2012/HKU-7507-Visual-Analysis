#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
movies表字段：
budget,genres,homepage,id,keywords,original_language,original_title,overview,popularity,production_companies,production_countries,release_date,revenue,runtime,spoken_languages,status,tagline,title,vote_average,vote_count

credits表字段：
movie_id,title,cast,crew

Goal:生成导演和演员的关系, 生成json 文件,格式参见network_vis.json
"""

import json
import pandas as pd
import numpy as np


# 加载movies 表, 电影基本属性数据
def load_tmdb_movies(path):
    df = pd.read_csv(path)
    return df


# 加载credits 表, 电影-演员-导演数据
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
#
# top30数据:
# 去重后, 演员+导演 总计 1673人, 导演 17人
# Return: 所有参与者（演员+导演）数据, 格式:{id,name,job,gender}
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

    print("导演数!=1 的电影数量 :", count)
    print("去重前, 演员+导演 总计人数: ", len(data))
    print("去重前, 导演数量 :", len(list(x for x in data if x['job'] == 'Director')))
    # 对 human_data 去重
    data = remove_duplicate(data)
    # 人数还是多，感觉还要进一步筛选
    print("去重后, 演员+导演 总计人数: ", len(data))
    # python lambda 表达式
    print("去重后, 导演数量 :", len(list(x for x in data if x['job'] == 'Director')))
    # 等同于
    # print("Director num:",len(list(filter(lambda x: x['job'] == 'Director', data))))
    return data


# dataframe: top100电影list（含演员+导演字段）
# nodes: 演员+导演的list，格式:{id,name,job,gender}
#
# 构建N*N 的二维数组 node_matrix,N=len(human_data),
# 对 x!=y, node_matrix[x,y] = x和y 两人共事过的电影数
# 计算矩阵，暂时不用了-------没想到还是靠这个救命
def compute_matrix(dataframe, nodes):
    # edge_matrix 保存边矩阵, edge_matrix[x][y] 代表xy两人共事次数。
    edge_matrix = np.zeros((len(nodes), len(nodes)), dtype=np.int)
    # node_matrix 保存点矩阵, node_matrix[x] 代表x人与node_matrix[x] 人共事过。
    node_matrix = np.zeros(len(nodes), dtype=np.int)

    # 逐行检测:movie_id,title,cast,crew
    for index, row in dataframe.iterrows():
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

    print(all_np(edge_matrix))

    # 将对称矩阵的一半数据去掉
    for i in range(len(nodes)):
        for j in range(0, i):
            edge_matrix[i][j] = 0

    dict_num = all_np(edge_matrix)
    for tmp in dict_num:
        print("任意两人共事 ", tmp, " 次的情况发生次数 ", dict_num[tmp])

    newNodes = []
    Edges = []
    # 遍历 edge_matrix 矩阵的一半(这是个对称矩阵)，存储edge 信息
    for i in range(len(nodes)):
        for j in range(i+1, len(nodes)):
            value = edge_matrix[i][j]
            if value > 1:
                # 只存储共事次数大于1 的数据
                Edges.append(
                    {'from': nodes[i]['id'], 'to': nodes[j]['id'], 'value': int(value)})
                if nodes[i] not in newNodes:
                    newNodes.append(nodes[i])
                if nodes[j] not in newNodes:
                    newNodes.append(nodes[j])

    print("只取共事次数大于1的数据, 共有 ",len(newNodes)," 人, 共有 ",len(Edges)," 边")

    network_json = {'node': newNodes, 'edge': Edges}
    return network_json


#  Numpy花式索引，获取所有元素的出现次数
def all_np(arr):
    arr = np.array(arr)
    key = np.unique(arr)
    result = {}
    for k in key:
        mask = (arr == k)
        arr_new = arr[mask]
        v = arr_new.size
        result[k] = v
    return result


# 这就是邻接表的做法 ------- 失败了，占用太多空间、时间，这是个垃圾代码！
# 生成network 展示的json 数据
# 入参: movie-actor-director数据集, 人的节点
# Return: Json network data
def generateJson(dataframe, human_data):
    json = {'node': [], 'edge': []}

    # 邻接表，存储所有边 i->j & j->i, 未相加
    Edges = []

    # 逐行检测:movie_id,title,cast,crew
    for index, row in dataframe.iterrows():
        # data 保存 当前处理的这部电影 中出现过的演员+导演 对应human_data 的序号索引(下标)
        data = []

        # 遍历 cast 数据:cast_id,character,credit_id,gender,id,name,order
        for cast in row.cast:
            item = {'id': cast['id'], 'name': cast['name'],
                    'job': 'actor', 'gender': cast['gender']}
            try:
                # 根据item 去human_data中查询index,可能出现某人在human_data 中存的是director,此处确实actor角色,导致查不到,此类数据忽略
                tmp = human_data.index(item)
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
                    tmp = human_data.index(item)
                except ValueError:
                    tmp = -1

                if (tmp not in data) and (tmp != -1):
                    data.append(tmp)

        # 到此为止，Data是 这部电影 的人物下标集合
        # 添加所有出现过的角色到json nodes 中
        for i in data:
            if (i not in json['node']):
                json['node'].append(human_data[i])

        print(len(json['node']))

        # 遍历行数据中的所有人, 添加 i->j 边数据到 edges 中, 忽略 j->i （无向图）
        for i in data:
            fromHuman = human_data[i]['id']
            # 构建 node 的所有边, 过滤 i->i 的数据
            for j in [t for t in data[data.index(i):] if t != i]:
                toHuman = human_data[j]['id']
                # 只记录 i->j, 不考虑 j->i, 再在最后对 i->j,j->i 的数据相加，得到ij两人总共合作次数
                i2j = list(
                    filter(lambda x: x['from'] == fromHuman and x['to'] == toHuman, Edges))

                if len(i2j) == 0:
                    # 说明 i->j 是未记录过的边, 记录出现次数value为1
                    edgeI2J = {'from': fromHuman, 'to': toHuman, 'value': 1}
                    Edges.append(edgeI2J)
                elif len(i2j) == 1:
                    # 说明 i->j 是记录过的边，更新value 加一
                    edgeI2J = {'from': fromHuman, 'to': toHuman,
                               'value': 1+i2j[0]['value']}
                    Edges.remove(i2j[0])
                    Edges.append(edgeI2J)
                else:
                    # 异常情况
                    print("i2j : " + len(i2j))

    # Edges 中应该不存在 重复的 i->j 数据
    # list().count

    # 遍历Edges ,计算 i->j,j->i 的数据相加，得到ij两人总共合作次数
    for edge in Edges:
        # 判断 是否已经计算过 i->j + j->i value 之和
        convertList = list(
            x for x in json['edge'] if x['from'] == edge['to'] and x['to'] == edge['from'])
        if len(convertList) == 0:
            # 初次计算
            tmp = list(x for x in json['edge'] if x['from']
                       == edge['to'] and x['to'] == edge['from'])[0]
            value = edge['value'] + tmp['value']
            json['edge'].append(
                {'from': edge['from'], 'to': edge['to'], 'value': value})
        # elif len(convertList) != 1:
            # 已经统计过，就跳过

    # 将 临界表 转换为 矩阵
    # edge_matrix 保存边矩阵, edge_matrix[x][y] 代表xy两人共事次数。
    # edge_matrix = np.zeros((len(json['node']), len(json['node'])), dtype=np.int)
    # for edge in Edges:
    # i = list(x['id'] for x in json['node']).index(edge['id'])
    return json


# 加载电影-演员-导演数据
# credits = load_tmdb_credits("./data/tmdb_5000_credits.csv")
# top100 电影
# credits = load_tmdb_credits("./data/tmdb_top100_data.csv")
# credits = load_tmdb_credits("./tmp/tmdb_top50_data.csv")
credits = load_tmdb_credits("./tmp/tmdb_top30_data.csv")


# 参与者（演员+导演）数据
human_data = compute_human_data(credits)
# write_data("./data/human_data.json", human_data)


# 保存点边数据
network_json_data = compute_matrix(credits, human_data)
write_data("./tmp/network_vis.json", network_json_data)

# write_data("./tmp/top30_network.json", {'id':[{'name':'wang'},{'age':12}],'name':[{'name':'wang'},{'age':12}]})

# jsonData = generateJson(credits, human_data)

# np.savetxt("./json/top100_edge.csv", result_edge, fmt="%d", delimiter=",")
# np.savetxt("./json/top100_node.csv", result_node, fmt="%d", delimiter=",")
# write_data("./data/adjacency_data.json", adjacency_data)

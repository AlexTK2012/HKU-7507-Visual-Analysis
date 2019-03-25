#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
判断是否存在相同的credit_id
Answer:不存在
"""

import json
import pandas as pd

# 加载credits 表
def load_tmdb_credits(path):
    df = pd.read_csv(path)
    json_columns = ['cast', 'crew']
    for column in json_columns:
        df[column] = df[column].apply(json.loads)
    return df


credits = load_tmdb_credits("./data/tmdb_5000_credits.csv")

credit_dict = dict()

for crew_index,crew_tmp in enumerate(credits['cast']):
    # 遍历 credits cast 数据
    # print ("crew_index : ",crew_index," , len : ",len(crew_tmp))

    for credit_index,credit_tmp in enumerate(crew_tmp):
        # 已知的 cast 字段:cast_id,character,credit_id,gender,id,name,order
        credit_id_tmp = credit_tmp['credit_id']

        # 查看是否存在异常数据
        if len(credit_tmp) != 7 or 'cast_id' not in credit_tmp or 'character' not in credit_tmp \
            or 'credit_id' not in credit_tmp or 'gender' not in credit_tmp or 'id' not in credit_tmp \
            or 'name' not in credit_tmp or 'order' not in credit_tmp:
            print ("abnormal data : credit_index : ",credit_index," , len : ",len(credit_tmp))
            print ("credit_id : ",credit_id_tmp,"id : ",credit_tmp['id']," , name : ",credit_tmp['name'])

        if credit_dict.get(credit_id_tmp) is None : 
            credit_dict[credit_id_tmp]=1
        else :
            # 存在相同credit_id,说明有可能不是打钱的id
            credit_dict[credit_id_tmp] = credit_dict.get(credit_id_tmp) + 1
            # print ("exist same credit_id : ",credit_id_tmp," , nums : ",credit_dict[credit_id_tmp])


same_credit = {k: v for k, v in credit_dict.items() if v > 1}
print (len(same_credit))
    
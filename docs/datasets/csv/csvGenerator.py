#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv
import statistics

columns = 9
rows = 1
data = [[0 for x in range(columns)] for y in range(rows)]

data[0][0] = "Industry"
data[0][1] = "Year"
data[0][2] = "Month"
data[0][3] = "Weekly-Earnings"
data[0][4] = "Employees-Thousands"
data[0][5] = "Date"
data[0][6] = "Delta_Employees-Thousands"
data[0][7] = "Average_Employees-Earnings"
data[0][8] = "Average_mployees-Thousands"



visited = []

i1 = input()

temp = i1.split("Series Id:")

for x in range(1, len(temp)):
    i = temp[x]
    t = i.split("Not Seasonally Adjusted")
    sid = t[0].strip()
    t = t[1].split("Industry:")
    t = t[1].split("NAICS Code:")
    ind = t[0].strip()
    t = t[1].split("Data Type:")
    t = t[1].split("Year")
    dtype = t[0].strip()
    
    if dtype == "ALL EMPLOYEES, THOUSANDS":
        col = 4
    else:
        col = 3
            
    t = t[1].strip()

    if ind not in visited:
        t = t.split("Dec")[1].strip()
        t = t.split("\n")
        
        for y in t:
            y = y.split(",")
            year = y[0]
            
            for i in range(1, len(y)):
                entry = []
                entry.append(ind)
                entry.append(year)
                entry.append(i)
                entry.append(0)
                entry.append(0)
                entry[col] = y[i]
                data.append(entry)

        visited.append(ind)
    
    else:
        t = t.split("Dec")[1].strip()
        t = t.split("\n")
        
        for y in t:
            y = y.split(",")
            year = y[0]
            
            for i in range(1, len(y)):
                for row in data:
                    if row[0] == ind and row[1] == year and row[2] == i:
                        row[col] = y[i]
                        break
    
# =============================================================================
# stringFinal = ""
# 
# for row in data:
#     for v in row:
#         stringFinal += str(v)
#         stringFinal += ","
#         
# stringFinal = stringFinal[0:len(stringFinal)-1]
# =============================================================================

zeros_removed_data = []

for row in data:
    if row[3] != " " and row[4] != " ":
        zeros_removed_data.append(row)

data = zeros_removed_data

delta = {}
average_wage = {}
average_employees = {}

for v in visited:
    delta[v] = 0.0
    average_wage[v] = []
    average_employees[v] = []
    
for i in range(1, len(data)):
    row = data[i]
    date = ""
    date += str(row[2])
    date += "/01/"
    date += str(row[1])
    row.append(date)
    
    average_wage[row[0]].append(float(row[3]))
    average_employees[row[0]].append(float(row[4]))

for key in delta:
    delta[key] = average_employees[key][0] - average_employees[key][len(average_employees[key])-1]
    average_employees[key] = statistics.mean(average_employees[key])
    average_wage[key] = statistics.mean(average_wage[key])

for i in range(1, len(data)):
    data[i].append(round(delta[data[i][0]], 2))
    data[i].append(round(average_wage[data[i][0]], 2))
    data[i].append(round(average_employees[data[i][0]], 2))

zeros_removed_data = []

for row in data:
    if row[3] != 0.0 and row[4] != 0.0:
        zeros_removed_data.append(row)

data = zeros_removed_data

with open('data_expanded.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)

    for row in data:
        writer.writerow(row)
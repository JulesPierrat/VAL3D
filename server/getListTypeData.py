import os

# Recup Path of VAL3D
f = open("PATH.txt", "r")
path = f.read()

# Recup the list of folder in the folder data
my_list = os.listdir(path + '\data')

# Convert my_list to send it to the client
liste = ''
n = len(my_list)
for i in range (n):
	liste += my_list[i]
	if (i != n-1):
		liste += ';'

# Send liste
print(liste)

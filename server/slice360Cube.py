# -*- coding: utf-8 -*-
"""
Created on Thu Jun 17 10:08:17 2021

@author: pierrat
"""


import cv2
import math
import sys



def slice(path):
    """
    Découpe une photo 360 en six morceau qui correspondent aux quatres face intérieur d'un cube.

    Parameters
    ----------
    path : string
        Chemin vers le dossier du projet qui contient les photos 360.
    num : int
        Numéro de la photo à découper.

    Returns
    -------
    None.

    """
    img = cv2.imread(path) # 512x512
    img_shape = img.shape
    size = int(img_shape[0]/3)
    tile_size = (size,size)
    offset = (size, size)
    
    for i in range(int(math.ceil(img_shape[0]/(offset[1] * 1.0)))):
        for j in range(int(math.ceil(img_shape[1]/(offset[0] * 1.0)))):
            
            # dessus
            if (i==0 and j==1):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_u.jpg", cropped_img)
                
            # gauche
            if (i==1 and j==0):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_l.jpg", cropped_img)
                
            # devant
            if (i==1 and j==1):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_f.jpg", cropped_img)
            
            # droite
            if (i==1 and j==2):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_r.jpg", cropped_img)
                
            # derriere
            if (i==1 and j==3):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_b.jpg", cropped_img)
                
            # dessous
            if (i==2 and j==1):
                cropped_img = img[offset[1]*i:min(offset[1]*i+tile_size[1], img_shape[0]), offset[0]*j:min(offset[0]*j+tile_size[0], img_shape[1])]
                # Debugging the tiles
                cv2.imwrite(path + "_d.jpg", cropped_img)
                
                
path = sys.argv[1]
print(path)

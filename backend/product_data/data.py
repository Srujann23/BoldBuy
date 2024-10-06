import os
import cloudinary
import cloudinary.uploader
import json
import re

# Configure Cloudinary
cloudinary.config(
    # cloud_name='',
    # api_key='',
    # api_secret=''
)

# Function to upload an "image" to Cloudinary and return its URL
def upload_image(image_name):
    extensions = ['.jpg', '.jpeg', '.png']  # Define the possible image extensions
    for ext in extensions:
        image_path = os.path.join('C:\\Users\\Owner\\OneDrive\\Desktop\\MERN\\eCommerce\\frontend\\src\\assets\\frontend_assets', image_name + ext)
        if os.path.exists(image_path):  # Check if the file exists
            try:
                response = cloudinary.uploader.upload(image_path)
                return response['secure_url']
            except Exception as e:
                print(f'Error uploading {image_name + ext}: {e}')
                return None
    print(f'No valid image found for {image_name} with specified extensions.')
    return None

# Load existing products from the JSON file or define it directly
products = [
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 100,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210150/pjpp2l53xwjojfzuyuqt.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "date": 1716634345448,
        "bestseller": "true"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 200,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210150/dssqlcym7hzg2zw5v11i.png",
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210152/gvwl8mapnthysp3o9xh2.png",
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210152/envsisro1qjhcyvxewxi.png",
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210153/rflo7q1jmqrrpsetaekw.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "M",
            "L",
            "XL"
        ],
        "date": 1716621345448,
        "bestseller": "true"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 220,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210153/tm17pacdbc3pye4eykrb.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "L",
            "XL"
        ],
        "date": 1716234545448,
        "bestseller": "true"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 110,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210154/aikkkw0u22ujpcru6c69.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "XXL"
        ],
        "date": 1716621345448,
        "bestseller": "true"
    },
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 130,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210155/tt7cnx3rlfd98mmdadne.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "M",
            "L",
            "XL"
        ],
        "date": 1716622345448,
        "bestseller": "true"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 140,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210156/bburbesuistadvpepnjw.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "L",
            "XL"
        ],
        "date": 1716623423448,
        "bestseller": "true"
    },
    {
        "name": "Men Tapered Fit Flat-Front Trousers",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 190,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210157/ncti07pazm3slet3kjeg.png"
        ],
        "category": "Men",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "L",
            "XL"
        ],
        "date": 1716621542448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 140,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210157/btw1xruocpxgbyjhtnja.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716622345448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 100,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210158/klgq2urqcqonvfbmgtsw.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "M",
            "L",
            "XL"
        ],
        "date": 1716621235448,
        "bestseller": "false"
    },
    {
        "name": "Men Tapered Fit Flat-Front Trousers",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 110,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210159/oopkfaiamqcaqykrc8nx.png"
        ],
        "category": "Men",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "L",
            "XL"
        ],
        "date": 1716622235448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 120,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210159/jsbhm66e7p9kz1h5mgb3.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L"
        ],
        "date": 1716623345448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 150,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210160/xyb2jptxfhbqsyy3zp85.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716624445448,
        "bestseller": "false"
    },
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 130,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210160/jzoe613snbnwuuodzrzp.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716625545448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 160,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210161/mnmq8tomyiyqq3rnoixm.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716626645448,
        "bestseller": "false"
    },
    {
        "name": "Men Tapered Fit Flat-Front Trousers",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 140,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210162/vmq0mvy0fqexdasbtntx.png"
        ],
        "category": "Men",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716627745448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 170,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210162/zoirf528hf7ibsckrcds.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716628845448,
        "bestseller": "false"
    },
    {
        "name": "Men Tapered Fit Flat-Front Trousers",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 150,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210163/fg5scax5frww8s30w7bx.png"
        ],
        "category": "Men",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716629945448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 180,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210164/li6ijz9go5jm700cdtth.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716631045448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 160,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210164/jswifv53bl8vko9zmcol.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716632145448,
        "bestseller": "false"
    },
    {
        "name": "Women Palazzo Pants with Waist Belt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 190,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210165/ixdzwjrn33a5pt7zc84k.png"
        ],
        "category": "Women",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716633245448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 170,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210166/uzgiewc8lmmeq5p2lchj.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716634345448,
        "bestseller": "false"
    },
    {
        "name": "Women Palazzo Pants with Waist Belt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 200,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210167/aqtmmddc9ld7tj4vvnve.png"
        ],
        "category": "Women",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716635445448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 180,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210167/qzecauh0n2el8cwo26sc.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716636545448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 210,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210168/ci7eq2cq1vy6psrvnsbv.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716637645448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 190,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210168/hruixroxwyx7wvrhiyr1.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716638745448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 220,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210169/cmqwyvitqm3zsvnrbc4d.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716639845448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 200,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210170/d183dlcxytbdw3ljuxtq.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716640945448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 230,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210170/omzx1m20eslnovb6oc5w.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716642045448,
        "bestseller": "false"
    },
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 210,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210171/jfjosur2fkppkgnvznct.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716643145448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 240,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210172/afzg0tyixfuexvlobibi.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716644245448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 220,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210172/upmcd8dkwdcraitjqm9j.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716645345448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 250,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210173/xyvrnu7wje0syx5rrbhl.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716646445448,
        "bestseller": "false"
    },
    {
        "name": "Girls Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 230,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210174/os67fwk10k7yrkbnzotk.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716647545448,
        "bestseller": "false"
    },
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 260,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210174/a2wzo8idz9zwpyp8nkga.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716648645448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 240,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210175/wogvuoevudcp6kkq83u6.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716649745448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 270,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210175/vvbvmsspw2cg4lwfheg3.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716650845448,
        "bestseller": "false"
    },
    {
        "name": "Women Round Neck Cotton Top",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 250,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210176/tfjcdplfotcl1bqvy4rb.png"
        ],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716651945448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 280,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210177/ckhl4m6l0crciz82so4g.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716653045448,
        "bestseller": "false"
    },
    {
        "name": "Men Printed Plain Cotton Shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 260,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210178/e0eclastdffgiramd4lp.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716654145448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 290,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210178/haucszknwglygukkhqty.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716655245448,
        "bestseller": "false"
    },
    {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 270,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210179/azechfqkksdx5zoeb3ya.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716656345448,
        "bestseller": "false"
    },
    {
        "name": "Boy Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 300,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210180/mhtomiqdkmanuwqbhfip.png"
        ],
        "category": "Kids",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716657445448,
        "bestseller": "false"
    },
    {
        "name": "Kid Tapered Slim Fit Trouser",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 280,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210180/rl4uswdhy1amdgpjaxis.png"
        ],
        "category": "Kids",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716658545448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 310,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210181/kntjllpmpsscxmdoyzhi.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716659645448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 290,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210182/d2o8gklwcrnpcuzy7h2g.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716660745448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 320,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210182/enk4ngtc4ndmujv5oimu.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716661845448,
        "bestseller": "false"
    },
    {
        "name": "Kid Tapered Slim Fit Trouser",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 300,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210183/hbetmrzycvddidutkaau.png"
        ],
        "category": "Kids",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716662945448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 330,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210184/pbipf0tppprutdgsn7vq.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716664045448,
        "bestseller": "false"
    },
    {
        "name": "Kid Tapered Slim Fit Trouser",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 310,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210184/zwf4muivlnlxj0zmviye.png"
        ],
        "category": "Kids",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716665145448,
        "bestseller": "false"
    },
    {
        "name": "Kid Tapered Slim Fit Trouser",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 340,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210185/kxxdjabsjsztzwetsmsv.png"
        ],
        "category": "Kids",
        "subCategory": "Bottomwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716666245448,
        "bestseller": "false"
    },
    {
        "name": "Women Zip-Front Relaxed Fit Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 320,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210185/tgsb3mileiaxeg8y5c3u.png"
        ],
        "category": "Women",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716667345448,
        "bestseller": "false"
    },
    {
        "name": "Men Slim Fit Relaxed Denim Jacket",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 350,
        "image": [
            "https://res.cloudinary.com/dtxply2x1/image/upload/v1728210186/k5ktbmigtbolfjovgljo.png"
        ],
        "category": "Men",
        "subCategory": "Winterwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "date": 1716668445448,
        "bestseller": "false"
    }
]
# Loop through products and replace "image" placeholders with URLs
for product in products:
    updated_images = []
    for image_name in product['image']:
        # Upload the image based on the placeholder name
        image_url = upload_image(image_name)  # Upload the image
        if image_url:
            updated_images.append(image_url)  # Add the URL to the updated images list
    product['image'] = updated_images  # Update the image field with URLs

# Save the updated products structure to a JSON file
with open('updated_products.json', 'w') as json_file:
    json.dump(products, json_file, indent=4)

print("Products updated with img URLs and saved to 'updated_products.json'!")

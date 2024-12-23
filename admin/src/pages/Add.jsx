import React, { useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", stock);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      // console.log(response.config.headers);
      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setStock('');
      }
      else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message);

    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Images</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className='w-20'
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt={`Upload Image ${index + 1}`}
              />
              <input
                onChange={(e) => {
                  switch (index) {
                    case 0: setImage1(e.target.files[0]); break;
                    case 1: setImage2(e.target.files[0]); break;
                    case 2: setImage3(e.target.files[0]); break;
                    case 3: setImage4(e.target.files[0]); break;
                    default: break;
                  }
                }}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          placeholder='Product Name'
          required
        />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Write Description here'
          required
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-4 w-full'>
  <div className="flex-1 sm:max-w-xs">
    <p className='mb-1 font-semibold'>Product Category</p>
    <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 border rounded-md'>
      <option value="Men">Men</option>
      <option value="Women">Women</option>
      <option value="Kids">Kids</option>
    </select>
  </div>

  <div className="flex-1 sm:max-w-xs">
    <p className='mb-1 font-semibold'>Sub Category</p>
    <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 border rounded-md'>
      <option value="Topwear">Topwear</option>
      <option value="Bottomwear">Bottomwear</option>
      <option value="Winterwear">Winterwear</option>
    </select>
  </div>

  <div className="flex-1 sm:max-w-xs">
    <p className='mb-1 font-semibold'>Product Price</p>
    <input
      onChange={(e) => setPrice(e.target.value)}
      value={price}
      className='w-full px-3 py-2 border rounded-md'
      type="number"
      placeholder='Enter Price'
      required
    />
  </div>

  <div className="flex-1 sm:max-w-xs">
    <p className='mb-1 font-semibold'>Product Stock Available</p>
    <input
      onChange={(e) => setStock(e.target.value)}
      value={stock}
      className='w-full px-3 py-2 border rounded-md'
      type="number"
      placeholder='Enter Stock'
      required
    />
  </div>
</div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex flex-wrap gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
            >
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
      </div>
      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  );
};

export default Add;

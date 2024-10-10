import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import { db } from './../../Config/FirebaseConfigs';
import { collection, getDocs, query } from 'firebase/firestore';
import ExploreProductList from '../../components/Explore/ExploreProductList';
import Fuse from 'fuse.js'; // Thêm thư viện Fuse.js

export default function Explore() {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProductByName(searchTerm);
      } else {
        setProductList([]); // Clear list if search term is empty
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchProductByName = async (name) => {
    setLoading(true); 
    const q = query(collection(db, 'ProductList'));
    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ id: doc.id, ...data });
    });

    // Sử dụng fuse.js để thực hiện tìm kiếm gần giống
    const fuse = new Fuse(products, {
      keys: ['name'], // Trường cần tìm kiếm
      threshold: 0.3, // Độ tương đồng: càng nhỏ thì càng gần giống
    });

    const result = fuse.search(name);
    const filteredProducts = result.map(res => res.item);

    setProductList(filteredProducts);
    setLoading(false); 
  };

  const handleSearchIconPress = () => {
    if (searchTerm.trim()) {
      searchProductByName(searchTerm);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: 'outfit-bold',
          fontSize: 25,
        }}
      >
        Explore More
      </Text>
      
      {/* SearchBar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 10,
          marginVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors.PRIMARY,
        }}
      >
        <TouchableOpacity onPress={handleSearchIconPress}>
          <Ionicons name="search" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={{ flex: 1 }}
        />
      </View>

      {/* Hiển thị thông báo khi đang tìm kiếm */}
      {loading && <Text>Loading...</Text>}
      
      {/* Hiển thị danh sách sản phẩm hoặc thông báo nếu không tìm thấy */}
      {!loading && productList.length === 0 && (
        <Text>No products found</Text>
      )}

      <ExploreProductList productList={productList} />
    </View>
  );
}

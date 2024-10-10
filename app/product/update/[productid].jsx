import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, ToastAndroid, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../../Config/FirebaseConfigs';
import { doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

export default function ProductUpdate() {
  const { productid } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetProductDetailById();
    fetchCategories();
  }, []);

  const GetProductDetailById = async () => {
    setLoading(true);
    const docRef = doc(db, 'ProductList', productid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      setProduct({ id: docSnap.id, ...productData });
      setName(productData.name);
      setPrice(productData.price);
      setImage(productData.imageUrl);
      setCategory(productData.category);
    } else {
      console.log("No such document!");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const categoryQuery = query(collection(db, 'Category'));
    const snapshot = await getDocs(categoryQuery);
    const categories = snapshot.docs.map((doc) => ({
      label: doc.data().name,
      value: doc.data().name,
    }));
    setCategoryList(categories);
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onUpdateProduct = async () => {
    setLoading(true);
    try {
      let imageUrl = image;
      if (image && image !== product.imageUrl) {
        const fileName = `${Date.now()}.jpg`;
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `/product-app/${fileName}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, 'ProductList', product.id), {
        name,
        price,
        category,
        imageUrl,
      });

      ToastAndroid.show('Product updated successfully!', ToastAndroid.LONG);
      router.back();
    } catch (error) {
      console.error('Error updating Product: ', error);
      ToastAndroid.show('Failed to update Product', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: '70%' }} size={'large'} color={Colors.PRIMARY} />
    );
  }

  return (
    <ScrollView style={{ marginTop: 20, paddingHorizontal: 15 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={40} color="black" />
      </TouchableOpacity>

      <Text style={{  fontSize: 20, marginBottom: 15 }}>Update Product Details</Text>

      {/* Image Picker */}
      <TouchableOpacity onPress={onImagePick} style={{ marginBottom: 15 }}>
        {image ? (
          <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: image }} />
        ) : (
          <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={require('./../../../assets/images/camera.png')} />
        )}
      </TouchableOpacity>

      {/* Product Name Input */}
      <TextInput
        placeholder="Tên Sản Phẩm"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      {/* Price Input */}
      <TextInput
        placeholder="Giá Sản Phẩm"
        value={price}
        onChangeText={setPrice}
        style={inputStyle}
      />

      {/* Category Picker */}
      <View style={[inputStyle, { padding: 0 }]}>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={categoryList}
          value={category}
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        disabled={loading}
        onPress={onUpdateProduct}
        style={buttonStyle}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={buttonTextStyle}>Update Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Common styles
const inputStyle = {
  
  fontSize: 17,
  padding: 10,
  borderWidth: 1,
  borderRadius: 5,
  backgroundColor: '#fff',
  marginVertical: 8,
  borderColor: Colors.PRIMARY,
};

const buttonStyle = {
  marginTop: 20,
  backgroundColor: Colors.PRIMARY,
  borderRadius: 5,
  paddingVertical: 15,
  alignItems: 'center',
};

const buttonTextStyle = {
  
  color: '#fff',
  textAlign: 'center',
};

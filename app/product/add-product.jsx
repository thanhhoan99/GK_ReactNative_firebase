
import Ionicons from '@expo/vector-icons/Ionicons'

import { View, Text, TouchableOpacity, TextInput, Image, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import RNPickerSelect from 'react-native-picker-select';
import { db, storage } from '../../Config/FirebaseConfigs';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function AddProduct() {
    const navigation = useNavigation();
    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState(null); // Set default value to null
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Add New Product'
        });
        GetCategoryList();
    }, []);

    const onImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        setImage(result?.assets[0].uri);
        console.log(result);
    }

    const GetCategoryList = async () => {
        setCategoryList([]);
        const q = query(collection(db, 'Category'));
        const snapShot = await getDocs(q);

        snapShot.forEach((doc) => {
            console.log(doc.data());
            setCategoryList(prev => [...prev, {
                label: doc.data().name,
                value: doc.data().name
            }]);
        });
    }

    const onAddNewProduct= async () => {
        setLoading(true);
        try {
            if (image) {
                const fileName = Date.now().toString() + ".jpg";
                const resp = await fetch(image);
                const blob = await resp.blob();

                const imageRef = ref(storage, '/product-app/' + fileName);
                await uploadBytes(imageRef, blob);
                const downloadUrl = await getDownloadURL(imageRef);

                await saveProductDetail(downloadUrl);
            } else {
                await saveProductDetail(null); // Handle case where no image is uploaded
            }
            // Clear all fields
            setName('');
            setPrice('');
            setCategory('');
            setImage(null);
            ToastAndroid.show('New Product added...', ToastAndroid.LONG);
        } catch (error) {
            console.error("Error adding product: ", error);
            ToastAndroid.show('Failed to add product', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    }

    const saveProductDetail = async (imageUrl) => {
        await setDoc(doc(db, 'ProductList', Date.now().toString()), {
            name: name,
            price: price,
            category: category,
            imageUrl: imageUrl
        });
    }

    return (
        <View style={{ padding: 20 }}>
             {/* "Go Back" Button */}
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={40} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 25, marginLeft: 10 }}>
                    Add Product
                </Text>
            </View>
            <Text style={{  fontSize: 13, color: Colors.GRAY }}>
                Fill all detail in order to add new product
                
            </Text>
            <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => onImagePick()}
            >
                {!image ? (
                    <Image style={{ width: 100, height: 100, borderRadius: 15 }}
                        source={require('./../../assets/images/camera.png')} />
                ) : (
                    <Image style={{ width: 100, height: 100 }}
                        source={{ uri: image }} />
                )}
            </TouchableOpacity>
            <View>
                <TextInput placeholder='Name'
                    value={name}
                    onChangeText={(v) => setName(v)}
                    style={{
                       
                        fontSize: 17,
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY
                    }} />
                <TextInput placeholder='Price'
                    value={price}
                    onChangeText={(v) => setPrice(v)}
                    style={{
                       
                        fontSize: 17,
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        marginTop: 10,
                        borderColor: Colors.PRIMARY
                    }} />

                <View style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    marginTop: 10,
                    borderColor: Colors.PRIMARY,
                }}>
                    <RNPickerSelect
                        onValueChange={(value) => setCategory(value)}
                        items={categoryList}
                        value={category}
                    />
                </View>
            </View>
            
          

            <TouchableOpacity
                disabled={loading}
                style={{ marginTop: 20, backgroundColor: Colors.PRIMARY, borderRadius: 5, paddingVertical: 15 }}
                onPress={() => onAddNewProduct()} >
                {loading ?
                    <ActivityIndicator size={'large'} color={'#fff'} /> :
                    <Text style={{
                      
                        color: '#fff',
                        textAlign: 'center'
                    }}>Add New Product</Text>
                }
            </TouchableOpacity>
            
        </View>
    );
}

import { View, Text, FlatList, TouchableOpacity, Share, Image } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'


export default function MenuList() {


    const menuList = [
        {
            id: 1,
            name: 'Add Product',
            icon: require('./../../assets/images/add.png'),
            path: '/product/add-product'
        },
        {
            id: 2,
            name: 'My App',
            icon: require('./../../assets/images/app.png'),
            path: '/product/my-product'
        }
      
    ]
    const router = useRouter();
    const onMenuClick = (item) => {
       
        router.push(item.path)
    }
    return (
        <TouchableOpacity
            // onPress={() => onMenuClick(item)}
            style={{ marginTop: 50 }}>
            <FlatList
                data={menuList}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                    onPress={() => onMenuClick(item)}
                        style={{
                        display: 'flex', flexDirection: 'row',
                        gap: 10, alignItems: 'center', flex: 1,
                        borderRadius: 15, borderWidth: 1, margin: 10,
                        borderColor: Colors.PRIMARY, backgroundColor: '#fff'
                    }}>
                        <Image source={item.icon}
                            style={{
                                width: 50,
                                height: 50
                            }}
                        />
                        <Text style={{
                           
                            flex: 1,
                            fontSize: 16
                        }}>{item.name}</Text>

                    </TouchableOpacity>
                )}
            />
            <Text style={{
               
                marginTop: 50, textAlign: 'center', color: Colors.GRAY
            }}>Developed by App</Text>
        </TouchableOpacity>
    )
}
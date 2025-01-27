import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    // TextInputComponent
    textInput: {
        height: 50, 
        width: 300, 
        borderColor: 'lightgray',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 16,
        borderWidth: 1,
        marginBottom: 15, 
    },

    // ButtonComponent
    buttonContainer: {
        width: 300, 
        marginBottom: 15, 
    },

    primaryBtn: {
        backgroundColor: '#FF0000',
        borderRadius: 50,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    primaryBtnText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
    },

    secondaryBtn: {
        backgroundColor: 'white',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FF0000',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    secondaryBtnText: {
        color: '#FF0000',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
    },

    // Additional Styles
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    subText: {
        fontSize: 16,
        color: '#666',
    },
    itemContainer: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },

    picker: {
        height: 60, 
        width: '100%', 
        marginVertical: 8, 
    },

    // Light Mode Styles
    lightContainer: {
        backgroundColor: '#FFF2F2',
    },
    lightText: {
        color: '#333',
    },

    // Dark Mode Styles
    darkContainer: {
        backgroundColor: '#333',
    },
    darkText: {
        color: '#fff',
    },
});

import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
    // Container 
    container: {
        flex: 1,
        backgroundColor: '#FFF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,  // Padding for the container
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
        marginBottom: 15,  // Margin between TextInput fields
    },

    // ButtonComponent
    buttonContainer: {
        width: 300,  // Ensure buttons are the same width as text inputs
        marginBottom: 15,  // Space between buttons
    },

    primaryBtn: {
        backgroundColor: '#FF0000',
        borderRadius: 50,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
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
        shadowOffset: {width: 0, height: 2},
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

});

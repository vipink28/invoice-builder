const invoice = {
    invoiceheader: {
        logo: "",
        invoicetype: "",
        invoicenumber: "",
        issuedate: "",
        duedate: "",
    },
    sender: {
        sendername: "",
        taxnumber: "",
        firstname: "",
        lastname: "",
        addressline1: "",
        addressline2: "",
        postalcode: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        website: "",
        compnayType: compnayType
    },
    recipient: {
        sendername: "",
        gstnumber: "",
        firstname: "",
        lastname: "",
        addressline1: "",
        addressline2: "",
        postalcode: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        website: "",
        compnayType: compnayType
    },
    itemslist: [
        {
            id: 1,
            name: "Item 1",
            quantity: 20,
            unitprice: 20,
            tax: 10,
            taxAmount: 40,
            subtotal: 440,
            description: "Chair",
            saved: true
        },
        {
            id: 2,
            name: "Item 2",
            quantity: 20,
            unitprice: 15,
            taxname: "",
            tax: 15,
            taxamount: 45,
            subtotal: 345,
            description: "Tables",
            saved: true
        }
    ],
    invoicesummary: {
        "subTotal": 700,
        "totalTax": 85,
        "grandTotal": 785
    },
    notes: "Please pay by cheque only"
}


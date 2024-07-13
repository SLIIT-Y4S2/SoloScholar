export interface LabSheet {
    realWorldScenario: string;
    detailedLabOutline: {
        subTopics: {
            title: string;
            description: string;
        }[]
    };
    supportingMaterial: {
        tables?: {
            tableName: string;
            columns: {
                name: string;
                type: string;
            }[];
            rows: {
                [key: string]: any;
            }[];
        }[];
        jsonDocument?: any;
        relationalSchema?: any;
    };
    questions: {
        question: string;
        answer: string;
        exampleQuestion: string;
        exampleAnswer: string;
    }[];

}

export const labSheet: LabSheet = {
    realWorldScenario: "In this practical lab scenario, students will be tasked with designing and implementing a database system for a hypothetical multinational corporation, GlobalTech Inc., which specializes in consumer electronics. GlobalTech Inc. is looking to overhaul its data management systems to improve operational efficiency, customer relationship management, and product lifecycle management. The company has operations in over 50 countries, with multiple manufacturing units, distribution channels, and a vast customer base. The primary challenge is to manage the extensive data generated from various sources including manufacturing processes, sales transactions, customer feedback, and supply chain operations.\n\nThe database system must cater to several critical requirements. First, it should efficiently store and manage detailed product information, including specifications, manufacturing details, batch numbers, and warranty information. This data is currently scattered across various legacy systems, leading to inefficiencies and frequent data discrepancies. Second, the database should handle complex sales transaction records that integrate with online and offline sales channels, providing real-time data accessibility to the sales and finance departments. Third, it should include a customer relationship management module that stores comprehensive customer data, purchase history, service requests, and interaction logs. This module will help in delivering personalized marketing and improving customer service.\n\nTo address these requirements, students will design a relational database with an emphasis on integrating XML data management capabilities. This integration is crucial as GlobalTech Inc. frequently exchanges product and transactional data with external partners in XML format. Students will need to implement XML schema definitions for various data types and ensure the database can efficiently query and manipulate XML data. The database design should include tables for products, sales, customers, and suppliers, with appropriate relationships and constraints to maintain data integrity. Additionally, students will develop stored procedures and triggers to automate common tasks like inventory updates and order processing. The final deliverable will be a fully functional database with a user interface for querying and managing the data, demonstrating the students' ability to apply theoretical knowledge to a complex, real-world problem. This project will not only enhance their technical skills in database design and XML integration but also their understanding of how databases can drive business efficiency and innovation.",
    detailedLabOutline: {
        subTopics: [
            {
                title: "Storing XML Documents in Databases",
                description: "This subtopic explores various methods for storing XML documents within database systems, including using traditional file systems, relational DBMS, and specialized XML DBMS. Key concepts include understanding the compatibility of XML documents with different storage approaches and the implications for data retrieval and querying. Bloom's Taxonomy levels involved are Understanding and Applying, as students need to comprehend the storage methods and apply this knowledge to select appropriate storage solutions."
            },
            {
                title: "Extracting XML Documents from Relational Databases",
                description: "Focuses on techniques and middleware necessary to convert and format data from relational databases into XML documents. This includes understanding the use of XSLT for transformations and middleware layers for data conversion. The learning outcomes target Bloom's Taxonomy levels of Analyzing and Applying, where students analyze the structure of relational databases and apply transformation techniques to generate XML documents."
            },
            {
                title: "Querying XML Documents",
                description: "Discusses the use of XPath and XQuery for querying XML documents stored in databases. Students learn to construct queries that effectively retrieve data from XML structures, emphasizing the hierarchical nature of XML and the syntax of these query languages. The Bloom's Taxonomy levels involved are Understanding and Applying, as students must understand the query syntax and apply it to retrieve data efficiently."
            },
            {
                title: "Mapping Relational Data to XML",
                description: "Covers the principles and challenges involved in mapping relational data models to XML schemas, including the use of SQL/XML to format SQL query results as XML data. This subtopic requires students to engage in higher-order thinking at the Analyzing and Creating levels of Bloom's Taxonomy, as they need to analyze the relational schema and create corresponding XML representations."
            }
        ]
    },
    "supportingMaterial": {
        "tables": [
            {
                "tableName": "Products",
                "columns": [
                    {
                        "name": "ProductID",
                        "type": "int"
                    },
                    {
                        "name": "ProductName",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "Specifications",
                        "type": "xml"
                    },
                    {
                        "name": "BatchNumber",
                        "type": "varchar(100)"
                    },
                    {
                        "name": "WarrantyInfo",
                        "type": "xml"
                    }
                ],
                "rows": [
                    {
                        "ProductID": 101,
                        "ProductName": "Smartphone Model X",
                        "Specifications": "<specs><memory>128GB</memory><color>Black</color></specs>",
                        "BatchNumber": "BN20230915",
                        "WarrantyInfo": "<warranty><years>2</years><type>International</type></warranty>"
                    }
                ]
            },
            {
                "tableName": "Sales",
                "columns": [
                    {
                        "name": "TransactionID",
                        "type": "int"
                    },
                    {
                        "name": "ProductID",
                        "type": "int"
                    },
                    {
                        "name": "SaleDate",
                        "type": "datetime"
                    },
                    {
                        "name": "Quantity",
                        "type": "int"
                    },
                    {
                        "name": "Price",
                        "type": "decimal(10,2)"
                    }
                ],
                "rows": [
                    {
                        "TransactionID": 5001,
                        "ProductID": 101,
                        "SaleDate": "2023-10-03T14:30:00",
                        "Quantity": 1,
                        "Price": 999.99
                    }
                ]
            },
            {
                "tableName": "Customers",
                "columns": [
                    {
                        "name": "CustomerID",
                        "type": "int"
                    },
                    {
                        "name": "CustomerName",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "ContactInfo",
                        "type": "xml"
                    },
                    {
                        "name": "LoyaltyPoints",
                        "type": "int"
                    }
                ],
                "rows": [
                    {
                        "CustomerID": 3001,
                        "CustomerName": "John Doe",
                        "ContactInfo": "<contact><email>john.doe@example.com</email><phone>1234567890</phone></contact>",
                        "LoyaltyPoints": 200
                    }
                ]
            },
            {
                "tableName": "Suppliers",
                "columns": [
                    {
                        "name": "SupplierID",
                        "type": "int"
                    },
                    {
                        "name": "SupplierName",
                        "type": "varchar(255)"
                    },
                    {
                        "name": "SupplyRegion",
                        "type": "varchar(100)"
                    }
                ],
                "rows": [
                    {
                        "SupplierID": 4001,
                        "SupplierName": "TechParts Ltd.",
                        "SupplyRegion": "Asia"
                    }
                ]
            }
        ],
        "jsonDocument": null,
        "relationalSchema": null
    },
    "questions": [
        {
            "question": "Write an SQL/XML query to retrieve the names of all products manufactured by GlobalTech Inc. that have a warranty period longer than 2 years, formatted as XML.",
            "answer": "SELECT XMLELEMENT(NAME \"Products\", XMLAGG(XMLELEMENT(NAME \"ProductName\", P.name))) FROM Products P WHERE P.warranty_period > 2;",
            "exampleQuestion": "Write an SQL/XML query to list all employees from the 'Sales' department, formatted as XML.",
            "exampleAnswer": "SELECT XMLELEMENT(NAME \"Employees\", XMLAGG(XMLELEMENT(NAME \"EmployeeName\", E.name))) FROM Employees E WHERE E.department = 'Sales';"
        },
        {
            "question": "Create an XML schema definition for a customer record that includes customer ID, name, and contact details.",
            "answer": "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'><xs:element name='Customer'><xs:complexType><xs:sequence><xs:element name='CustomerID' type='xs:string'/><xs:element name='Name' type='xs:string'/><xs:element name='ContactDetails' type='xs:string'/></xs:sequence></xs:complexType></xs:element></xs:schema>",
            "exampleQuestion": "Create an XML schema definition for a supplier record that includes supplier ID, name, and address.",
            "exampleAnswer": "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'><xs:element name='Supplier'><xs:complexType><xs:sequence><xs:element name='SupplierID' type='xs:string'/><xs:element name='Name' type='xs:string'/><xs:element name='Address' type='xs:string'/></xs:sequence></xs:complexType></xs:element></xs:schema>"
        },
        {
            "question": "Write an XQuery to extract all customer names and their purchase history from an XML document stored in the database.",
            "answer": "FOR $cust IN doc('customers.xml')//customer RETURN <result>{$cust/name, $cust/purchases}</result>",
            "exampleQuestion": "Write an XQuery to extract all supplier names and their product lists from an XML document stored in the database.",
            "exampleAnswer": "FOR $supp IN doc('suppliers.xml')//supplier RETURN <result>{$supp/name, $supp/products}</result>"
        },
        {
            "question": "Design a stored procedure in SQL that inserts a new product into the 'Products' table and updates the XML document of product listings.",
            "answer": "CREATE PROCEDURE AddProduct(@name NVARCHAR(100), @warranty INT) AS BEGIN INSERT INTO Products (name, warranty_period) VALUES (@name, @warranty); UPDATE ProductListings SET product_list.modify('insert <product><name>{sql:variable(\"@name\")}</name><warranty>{sql:variable(\"@warranty\")}</warranty></product> into (/productList)[1]') END;",
            "exampleQuestion": "Design a stored procedure in SQL that deletes an employee from the 'Employees' table and updates the XML document of employee listings.",
            "exampleAnswer": "CREATE PROCEDURE DeleteEmployee(@empID INT) AS BEGIN DELETE FROM Employees WHERE employee_id = @empID; UPDATE EmployeeListings SET employee_list.modify('delete /employeeList/employee[employee_id=\"{sql:variable(\"@empID\")}\"]') END;"
        },
        {
            "question": "Write an SQL query using SQL/XML functions to generate an XML document that lists all products with their prices in descending order.",
            "answer": "SELECT XMLROOT(XMLAGG(XMLELEMENT(NAME \"Product\", XMLFOREST(P.name AS \"Name\", P.price AS \"Price\"))), VERSION '1.0') FROM Products P ORDER BY P.price DESC;",
            "exampleQuestion": "Write an SQL query using SQL/XML functions to generate an XML document that lists all employees with their salaries in ascending order.",
            "exampleAnswer": "SELECT XMLROOT(XMLAGG(XMLELEMENT(NAME \"Employee\", XMLFOREST(E.name AS \"Name\", E.salary AS \"Salary\"))), VERSION '1.0') FROM Employees E ORDER BY E.salary ASC;"
        },
        {
            "question": "Develop an XSLT template that transforms product XML data into an HTML table for display on a web page.",
            "answer": "<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'><xsl:template match='/'><html><body><table><xsl:for-each select='products/product'><tr><td><xsl:value-of select='name'/></td><td><xsl:value-of select='price'/></td></tr></xsl:for-each></table></body></html></xsl:template></xsl:stylesheet>",
            "exampleQuestion": "Develop an XSLT template that transforms employee XML data into an HTML list for display on a web page.",
            "exampleAnswer": "<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'><xsl:template match='/'><html><body><ul><xsl:for-each select='employees/employee'><li><xsl:value-of select='name'/></li></xsl:for-each></ul></body></html></xsl:template></xsl:stylesheet>"
        },
        {
            "question": "Write an SQL/XML query to create an XML snapshot of the current inventory, including product names and quantities.",
            "answer": "SELECT XMLROOT(XMLAGG(XMLELEMENT(NAME \"InventoryItem\", XMLFOREST(I.product_name AS \"ProductName\", I.quantity AS \"Quantity\"))), VERSION '1.0') FROM Inventory I;",
            "exampleQuestion": "Write an SQL/XML query to create an XML snapshot of current employee assignments, including employee names and project IDs.",
            "exampleAnswer": "SELECT XMLROOT(XMLAGG(XMLELEMENT(NAME \"Assignment\", XMLFOREST(A.employee_name AS \"EmployeeName\", A.project_id AS \"ProjectID\"))), VERSION '1.0') FROM Assignments A;"
        },
        {
            "question": "Create an XML schema that defines the structure for a sales transaction, including transaction ID, date, product ID, and amount.",
            "answer": "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'><xs:element name='Transaction'><xs:complexType><xs:sequence><xs:element name='TransactionID' type='xs:string'/><xs:element name='Date' type='xs:date'/><xs:element name='ProductID' type='xs:string'/><xs:element name='Amount' type='xs:decimal'/></xs:sequence></xs:complexType></xs:element></xs:schema>",
            "exampleQuestion": "Create an XML schema that defines the structure for an employee record, including employee ID, name, department, and salary.",
            "exampleAnswer": "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'><xs:element name='Employee'><xs:complexType><xs:sequence><xs:element name='EmployeeID' type='xs:string'/><xs:element name='Name' type='xs:string'/><xs:element name='Department' type='xs:string'/><xs:element name='Salary' type='xs:decimal'/></xs:sequence></xs:complexType></xs:element></xs:schema>"
        },
        {
            "question": "Write an XQuery to retrieve all XML documents related to customer feedback, filtering only those with a rating above 4.",
            "answer": "FOR $doc IN doc('feedback.xml')//feedback WHERE $doc/rating > 4 RETURN $doc",
            "exampleQuestion": "Write an XQuery to retrieve all XML documents related to supplier evaluations, filtering only those with a rating above 3.",
            "exampleAnswer": "FOR $doc IN doc('evaluations.xml')//evaluation WHERE $doc/rating > 3 RETURN $doc"
        }
    ]
}
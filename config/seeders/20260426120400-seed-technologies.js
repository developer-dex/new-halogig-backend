/* eslint-disable */
module.exports = {
  up: async (queryInterface) => {
    const t1 = '2026-03-24 22:20:57';
    const t2 = '2026-03-25 09:33:13';
    const t3 = '2026-03-25 09:34:45';

    const rows = [];
    const add = (id, name, ts) => rows.push({ id, name, created_at: ts, updated_at: ts });

    // IDs 1-603: main technologies
    const main = [
      'Dotnet','1C Bitrix','3D Modeling Software','8base','A/B Testing','ABAP','Accessibility','Ada','Adalo','AdMob',
      'Adobe Air','Adobe Flash','Adobe Software','AG Grid','Agile','AI','AirDev Canvas','Airtable','AJAX','Alexa',
      'Algorithm','Altcoin','Amazon API','Amazon Backend','Amazon EC2','Amazon S3','Amazon Webstore','Analytics','Android','Android Studio',
      'Angular','Angular JS','Animation','Ansible','Apache Airflow','Apache Cordova','Apache','Apache Kafka','Apache OFBiz','Apache Spark',
      'Apache Velocity','Apex','API','App','App Store','Appcelerator','Appgyver','Appian','Apple Pay','Apple Xcode',
      'AppSheet','ArcGIS','Arduino','ARKit','ARM','Artificial Intelligence','Asana','ASP.NET','Asterisk','Augmented Reality',
      'Aurelia','Auth0','Authorize.Net','Autodesk Revit','Automation','Autotask','Avalanche','AWS Cognito','AWS','AWS DevOps',
      'AWS EMR','AWS IAM','AWS Lambda','AWS RDS','AWS Textract','Azure','Babylon.js','Backbone.js','Back-End','Backendless',
      'Banshee','Big Data','BigCommerce','BigQuery','Binance API','Bitcoin','Blazor','Blender','Blockchain','Bluetooth',
      'Bolt AI','Bootstrap','Bot','Box','BPM','Brand','BrowserStack','Bubble','BuddyPress','Business Intelligence',
      'C','C#','C++','CakePHP','Calconic','Canvas','Chart.js','Chatbot','ChatGPT','Chrome Extension',
      'Chrome OS','Chromecast','CI/CD','Cisco','Classic ASP','Clipper','Clojure','Cloud','Cloudflare','Clover',
      'CMS','COBOL','CodeIgniter','CodePen','CoffeeScript','ColdFusion','Computer Vision','Contentful','CouchDB','Craft CMS',
      'CRM','Cross-platform','Cryptographers','Crystal Reports','CSS','Cucumber','CUDA','Cybersecurity','d3.js','\u00D0App',
      'Dart','Dashboard','Data','Data Extraction','Data Migration','Data Scraping','Data Visualization','Data Warehouse','Database Design and Construction','Database',
      'Databricks','Datadog','DAX','Debugging','Deep Learning','DeepSeek','DeFi','Delphi','Demandware','DevExpress',
      'DevOps','DirectX','Discord Bot','Django','Dlang','DNS','Docker','Docusign','Dropbox','Drupal',
      'eBay API','Eclipse RAP','E-commerce','Ejabberd','Electron.js','Elementor','Elixir','Elm','Embedded Software','Ember.js',
      'Enfold WordPress','Enterprise Application','Erlang','ERP','ERPNext','ESP32','Ethereum','Ethical Hackers','ETL','Evernote',
      'Excel','Excel Macro','Expedia','Express.js','ExpressionEngine','Extended Reality','ExtJS','Facebook API','FFmpeg','Figma',
      'Fintech','Firebase','Firestore','Firmware','Fitbit','Flask','Flex','Flutter','FlutterFlow','Forex Trading',
      'FPGA','Framer','Front-End','Full Stack','Game','GatsbyJS','Gemini','Genesis Framework','GIS','GIMP',
      'Git','GitHub','GKE','Glide','Gmail','Golang','Google Adwords','Google','Google API','Google App Engine',
      'Google Apps Script','Google Cloud','Google Cloud Platform','Google Data Studio','Google Drive','Google Forms','Google Maps API','Google Sheets','Google Sites','Google Software',
      'GPT-3','GPT-4','Grafana','Grails','GraphQL','Gravity Forms','gRPC','Gulp','Hadoop','Haskell',
      'Haxe','HDFS','HelpScout','Heroku','HFT','Hibernate','Highcharts','HTC Vive','HTML','HTML5',
      'HubSpot','Hugo','Human Machine Interface','Hybrid App','Hybris','Hyperledger','iBeacon','IBM SPSS','IBM Watson','IFTTT',
      'IIS','Image Processing Software','Image/Object Recognition','Indian Web','Infusionsoft','Instagram API','Integration','Intercom','Ionic','iOS',
      'IoT','iPhone App','IT Outsourcing','Java','Java EE','JavaScript','JBoss','JDBC','Jenkins','Jet Admin',
      'Jira','Joomla','jQuery','JSON','JUnit','Jython','Kajabi','Kentico','Keycloak','Klaviyo API',
      'Kotlin','Kubernetes','LAMP','Laravel','LDAP','Leap Motion','LearnDash','LearnWorlds','LinkedIn API','Linux',
      'Liquid','Lisp','LLM','LMS','Lodash','Low-code','Lua','Mach-II','Machine Learning','MacOS',
      'Magento','Magento2','MailChimp','Make','Mapbox','MATLAB','MEAN','Memberstack','MERN','MetaTrader 4',
      'MetaTrader 5','Meteor','Microservices','Microsoft Access','Microsoft','Microsoft Dynamics 365','Microsoft Dynamics CRM','Microsoft Excel PowerPivot','Microsoft Power BI','Microsoft SQL',
      'Microsoft Teams','Migration','Miro','Mixpanel','Mobile App','MODx','MongoDB','MonoRail','Moodle','MQL 4',
      'MS Office 365','Multithreading','Mustache','MYSQL','n8n','NativeScript','Neo4j','NestJS','NetSuite','Neural Network',
      'Next.js','Nexus','NFT','Nginx','NLP','NoCodeAPI','Node.js','Node-RED','nopCommerce','NoSQL',
      'Notion','NumPy','Nuxt.js','OAuth 2.0','Objective-C','OBS Studio','OCaml','OCR Tesseract','Odoo','Offshore',
      'Okta','OLAP','Open Source','OpenAI','OpenCart','OpenCV','OpenGL','OpenStack','Optical Character Recognition','Oracle',
      'Outsourced','OutSystems','Page Speed Optimization','Pardot','Parse','Payment Processing','PayPal','Perl','PhoneGap','PHP',
      'Plaid API','Play Framework','Plone','Pocket','POS','PostgreSQL','Postman','Power Automate','Power BI','PowerApps',
      'Preact','PrestaShop','Prism','Product','Prompt','Prototype','Puppeteer','PWA','PyQt','Python',
      'PyTorch','QA','Qlik','QR Code','Qt','Quantitative','Quantum Computing','QuickBase','QuickBooks','R',
      'RabbitMQ','Raspberry Pi','RDBMS','React','React Native','Realm','Recommendation Systems','Redis','Redux','Remote',
      'Replit AI','REST API','Retool','RAG','Robotics','Roku','RPA','RStudio Shiny','RTOS','Ruby',
      'Ruby on Rails','Rust','RxSwift','SaaS','Sage','Salesforce Commerce Cloud','Salesforce','Salesforce Lightning','SAML','SAS',
      'Sass','SCADA','Scala','Schema','Security','Selenium','Selenium WebDriver','Sencha Touch','SendGrid','Serverless',
      'ServiceNow','SharePoint','Shopify','Shopware','SilverStripe','Site Reliability','Site Speed Optimization','Sitecore','Sitefinity','Skaffolder',
      'Slack','Smart Contracts','Snowflake','Socket.IO','Software','Solidity','SolidWorks','Splunk','Spotify','Spring Boot',
      'Spring Framework','SquareSpace','SSIS','SSL','SSO','SSRS','Stacker','Startup','Stata','Statistics',
      'Strapi','Streamlit','Stripe','SugarCRM','Svelte','SVG','Swagger','Swift','Sybase','Symfony',
      'System Security','Systems','Tableau','Tailwind CSS','Tech','Telegraf','Telerik','TensorFlow','Terraform','Test Automation',
      'Test','Three.js','Thunkable','Tizen','TradeStation','TradingView','Trello','Tumblr','Twilio','Twitch',
      'Twitter Bootstrap','Twitter','Typescript','TYPO3','Ubuntu','UDP','UI','UiPath','Umbraco','UML',
      'Unity','Unity3D','Unix','Unreal Engine','Vaadin','Varnish','VB.NET','VBA','VBScript','Vercel',
      'Verilog','VHDL','Vimeo','Virtual Reality','Virtualization','Visio','Visual Basic','Visual Studio','Visualforce','VMware',
      'Voiceflow','VoIP','vTiger','Vue.js','Vuforia','Vulnerability Assessment','Web Application','Web Crawler','Web','Web Services',
      'Web Testing','Web3','WebAssembly','Webflow','WebGL','WebRTC','Website','WebSphere','Weebly','Whisper',
      'Windows','Windows PowerShell','Wix','Woocommerce','WordPress','Wordpress Theme','Wowza','WPF','Xamarin','Xano',
      'Xbox','Xcode','Xero','XML','XSLT','Yelp API','Yeoman','Yii','Zapier','Zendesk',
      'Zoho','Zoom','SAP',
    ];
    main.forEach((name, i) => add(i + 1, name, t1));

    // IDs 604-647: AI technologies
    const ai = [
      'Generative AI Specialist','Prompt Engineering','Chatbot','Machine Learning','LLM','Azure Open AI','AI Text-to-Image','AI Text-to-Speech','OpenAI Codex','NLP',
      'Autoencoder','Variational Autoencoder','Azure OpenAI','AI & Data Service','Data Scientist','Data Annotation','AI Framework & Technology','ChatGPT','Neural Network','Model Tuning',
      'Generative Adversarial Network','Gradio','Hugging Face','Replit','Streamlit','BLOOM','GPT Neo','GPT-3','GPT-J','Deep Learning',
      'Tensorflow','Computer Vision','Google BERT','AI Consulting','AI Research','AI Model Integration','AI Development & Integration','AI App','AI API Integration','AI Model',
      'MLOps','AI Image Generation & Editing','AI Speech & Audio Generation','AI Video Generation & Editing',
    ];
    ai.forEach((name, i) => add(604 + i, name, t2));

    // IDs 648-722: Engineering technologies
    const eng = [
      'Arduino','Product Formulation','Industrial Designer','PCB Designer','3D Modeler','Injection Mold Design','Verilog / VHDL','AutoCAD Civil 3D','Architectural Designer','Electronics',
      'Computational Fluid Dynamics (CFD)','Photorealistic Rendering','Architectural Rendering','Engineering Drawing','Autodesk Revit','3D Rendering Artist','SolidWorks Designer','Electrical Drawing','Automotive Design','AutoCAD',
      'Drafting','CAD Designer','Estimating','Control Engineering','Landscape Designer','Interior Designer','MATLAB','Fusion 360','LabVIEW','ANSYS',
      'Mechanical','Reverse','Circuit Designer','Digital Signal Processing','Electrical','Buying','Estimator','SketchUp','Product Designer','Scientific Researcher',
      'Sketch Artist','Structural','3D Designer & Artist','CAD Drafting','2D Drafter','Chief Architect Designer','Environmental Designer','Lighting','Aerospace','CI/CD',
      'Fire Protection','Home Designer','Naval Architect','Architectural Modeler','Design','Hydraulic','Parametric Designer','Professional','Engineering Designer','Landscape Architect',
      'Infrastructure','Microcontroller','KiCad','Automation','Firmware','FPGA','IoT','Simulation','Embedded System','Analog Electronic',
      'Lab Equipment Consultant','Prototyping Consultant','Robotics','Autosar','PLC',
    ];
    eng.forEach((name, i) => add(648 + i, name, t3));

    // Insert in batches
    for (let i = 0; i < rows.length; i += 100) {
      await queryInterface.bulkInsert('technologies', rows.slice(i, i + 100), {});
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('technologies', null, {});
  },
};

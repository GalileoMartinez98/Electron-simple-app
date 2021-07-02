const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

    
if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {      //para refrescar
    electron: path.join(__dirname, '../nodle_modules',".bin", "electron")       //para que tambien me refresque electron
        
    });
}

let mainWindow; //variable de la ventana principal
let NewProductWindow;  //variable de nuevo

app.on('ready', () => {     //inicializar la ventana
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false
        },
        width: 720, height: 600

    });
    mainWindow.loadURL(url.format({
       pathname: path.join(__dirname, 'views/index.html'),      //ruta del archivo principal
       protocol: 'file', 
       slashes: true
   }))
   
   const mainMenu = Menu.buildFromTemplate(templateMenu);
   Menu.setApplicationMenu(mainMenu);

   mainWindow.on('close', () =>{        //cerrar todo
       app.quit();
   });
 });

function createNewProductWindow() {     //crear nuevo producto
    NewProductWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
           
        },
        width: 390,
        height: 330,
        title: 'Add new product',
    });
   
    NewProductWindow.setMenu(null);  
    NewProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),      //ruta del archivo principal
        protocol: 'file', 
        slashes: true 
        }));

    NewProductWindow.on('closed', () => {
        NewProductWindow = null;
    });
}

//recibiendo los datos principales desde la otra pestaña
ipcMain.on('product:new', (e, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct);
    NewProductWindow.close();
});

const templateMenu = [     //menus personalizado
{
    label: 'Files',        
    submenu: [
        {
            label: "New product",
            accelerator: "Ctrl+N",      //atajo de teclado
            click(){
                createNewProductWindow();
               // alert("Nuevo producto") 
            }
        },
    {
    label: 'Exit',
    accelerator: process.platform == 'darwin' ? 'command + Q' : "Ctrl+Q",
        click(){
            app.quit();
            }
    },
        {   
        label: "Remove all products",
            click(){
                mainWindow.webContents.send('products:remove-all');
            }
        },
    ]
}, 
];
//para mac
if (process.platform  ==='darwin') {
    templateMenu.unshift({
        label: app.getName()
    });
    
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu:[{
            role:'reload'
        },
        {
            label: 'Show/Hide Dev Tools',
            accelerator: 'Ctrl+D',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        }
        ]
    })
}

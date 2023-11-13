function GenerateQrCode(value) {

    var topLogoSrc;
    var description = {};
    var qrCode;

    // Pobranie src logo
    getTopLogoSrc();

    // Główny kontener
    var mainContainer = createMainContainer();

    // Dodajemy elementy do głównego kontenera
    var logo = createLogo(mainContainer);
    var timer = createTimer(mainContainer);
    var exit = createExit(mainContainer);
    var title = createTitle(mainContainer, 'QR Code Generator');
    var note = createNote(mainContainer, 'Wygenerowany QR kod:');
    var qrCodeContainer = createQrCodeContainer(mainContainer);
    var buttonContainer = createButtons(mainContainer);

    // Dodanie głównego kontenera do body dokumentu
    document.body.appendChild(mainContainer);

    // Główna funkcja
    getQrHiddenTable(value);

    // Funkcja do pobierania i dekodowania wartości ukrytej tabeli
    function getQrHiddenTable(id) {
        var hiddenTable = document.querySelector('[id*="' + id + '"]');

        if (!hiddenTable) {
            console.log("Nie znaleziono elementu o id zawierającym '" + id + "'.");
        } else {
            var value = hiddenTable.value;
            if (value === undefined || value === null || value === "") {
                console.log("Brak danych");
            } else {
                decodeHiddenTable(value);
            }
        }
    }

    // Funkcja do dekodowania ukrytej tabeli
    function decodeHiddenTable(hiddenTableContent) {
        try {
            var parsedData = JSON.parse(hiddenTableContent);
            splitData(parsedData);
        } catch (error) {
            console.error("Błąd parsowania JSON:", error);
        }
    }

    // Funkcja do podziału danych
    function splitData(parsedData) {
        var qrcodeData = {};

        for (var key in parsedData) {
            if (key === "QRcode") {
                qrcodeData[key] = parsedData[key];
            } else {
                description[key] = parsedData[key];
            }
        }
        var qrcodeValue = qrcodeData["QRcode"];

        // Generowanie opisu
        createDescription(qrCodeContainer, description);
        // Generowanie kodu QR
        createQrCode(qrCodeContainer, qrcodeValue);
    }

    // Funkcja do tworzenia QR kodu
    function createQrCode(container, qrcodeValue) {
         qrCode = new QRCode(container, {
             text: qrcodeValue,
            width: 228,
            height: 228,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
         });
    }

    // Funkcja do generowania elementu opisu
    function createDescription(container, description) {
        var dataElement = document.createElement('p');
        dataElement.style.fontWeight = 'bold';
        dataElement.style.fontSize = '16px';
        dataElement.style.textAlign = 'left';
        for (var key in description) {
            dataElement.innerHTML += key + ': ' + description[key] + '<br>';
        }

        container.appendChild(dataElement);
    }

    function createMainContainer() {
        var container = document.createElement('div');
        container.id = 'main-qrcode-container';
        container.style.position = 'absolute';
        container.style.zIndex = '9999';
        container.style.minHeight = '500px';
        container.style.minWidth = '350px';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #fcfcfc';
        container.style.padding = '20px';
        container.style.textAlign = 'center';
        container.style.borderRadius = '3px';
        container.style.boxShadow = '0px 0px 12px 3px rgba(0, 0, 0, 0.4)';

        return container;
    }

    function createQrCodeContainer(container) {
        var qrCodeContainer = document.createElement('div');
        qrCodeContainer.id = 'qrcode-container';
        qrCodeContainer.style.display = 'flex';
        qrCodeContainer.style.flexDirection = 'column';
        qrCodeContainer.style.alignItems = 'center';
        qrCodeContainer.style.justifyContent = 'center';
        container.appendChild(qrCodeContainer);
        return qrCodeContainer;
    }

    function createLogo(container) {
        var logoContainer = document.createElement('div');
        logoContainer.style.position = 'absolute';
        logoContainer.style.top = '0';
        logoContainer.style.left = '0';
        logoContainer.style.padding = '5px';

        var logoImage = document.createElement('img');
        logoImage.id = 'ctl00_topBox_top_logo';
        logoImage.className = 'top_logo';
        logoImage.src = topLogoSrc;
        logoImage.style.width = '50px';

        logoContainer.appendChild(logoImage);
        container.appendChild(logoContainer);
    }

    function createTimer(container) {
        var timerElement = document.createElement('div');
        timerElement.style.position = 'absolute';
        timerElement.style.top = '0';
        timerElement.style.left = '0';
        timerElement.style.right = '0';
        timerElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        timerElement.style.padding = '5px';
        container.appendChild(timerElement);

        var startTime = Date.now();
        var timerInterval = setInterval(function () {
            var currentTime = Date.now();
            var elapsedTime = currentTime - startTime;
            var remainingTime = 15000 - elapsedTime;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                document.body.removeChild(container);
            } else {
                var secondsRemaining = Math.ceil(remainingTime / 1000);
                timerElement.textContent = 'Pozostały czas: ' + secondsRemaining + ' sekund';
            }
        }, 1000);
    }

    function createExit(container) {
        var exitElement = document.createElement('div');
        exitElement.style.position = 'absolute';
        exitElement.style.top = '0';
        exitElement.style.right = '0';
        exitElement.style.padding = '5px';
        exitElement.style.cursor = 'pointer';
        exitElement.innerHTML = '&#10060;'; // Kod HTML dla krzyżyka

        exitElement.style.color = 'red';

        exitElement.addEventListener('click', function () {
            container.remove();
        });

        container.appendChild(exitElement);
    }

    function createTitle(container, titleText) {
        var title = document.createElement('h1');
        title.textContent = titleText;
        container.appendChild(title);
    }

    function createNote(container, descriptionText) {
        var description = document.createElement('p');
        description.textContent = descriptionText;
        container.appendChild(description);
    }

    function createButtons(container) {
        var buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.left = '50%';
        buttonContainer.style.transform = 'translateX(-50%)';
        buttonContainer.style.width = '100%';
        buttonContainer.style.padding = '0 6px';
        container.appendChild(buttonContainer);

        var printButton = createButton('Generuj', 'e2-button', function () {
            var qrCodeImage = qrCodeContainer.querySelector('img');
            var paragraphText = qrCodeContainer.querySelector('p').innerHTML;

            printQRCode(qrCodeImage, paragraphText);
        }, '200px');
        var cancelButton = createButton('Anuluj', 'e2-button', function () {
            document.body.removeChild(container);
        });

        buttonContainer.appendChild(printButton);
        buttonContainer.appendChild(cancelButton);
    }

    function createButton(text, className, clickHandler, width) {
        var button = document.createElement('input');
        button.type = 'submit';
        button.value = text;
        button.className = className;

        if (width) {
            button.style.width = width;
        }

        button.addEventListener('click', clickHandler);
        return button;
    }

    // Funkcja do pobierania wartości atrybutu "src" z elementu o klasie "top_logo"
    function getTopLogoSrc() {
        var topLogoElement = document.querySelector('.top_logo');
        if (topLogoElement) {
            topLogoSrc = topLogoElement.getAttribute('src');
            return topLogoSrc;
        } else {
            console.log('Nie znaleziono elementu o klasie "top_logo"');
            return null;
        }
    }

    // Zainicjuj Set do śledzenia otwartych okien podrzędnych
    var childWindows = new Set();

    function printQRCode(img, desc) {

        // Otwarcie okna do wdyruku
        var printWindow = window.open('', '', 'width=1050,height=650');

        // Dodaj otwarte okno podrzędne do Set
        childWindows.add(printWindow);

        // Otwarcie dokument drukarki
        printWindow.document.open();

        // Dodanie nagłówka do dokumentu
        printWindow.document.write('<html><head><title>Podgląd dokumentu</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('@media print {');
        printWindow.document.write('  div.page-break {');
        printWindow.document.write('    page-break-before: always;');
        printWindow.document.write('  }');
        printWindow.document.write('  img {');
        printWindow.document.write('    width: 100%; ');
        printWindow.document.write('    height: auto;');
        printWindow.document.write('  }');
        printWindow.document.write('}');
        printWindow.document.write('</style>');
        printWindow.document.write('</head>');
        printWindow.document.write('<body style="margin: 0; padding: 0;">');

        // Dodanie zawartość dokumentu
        printWindow.document.write('<div class="page-break" style="text-align: center; padding: 10px; position: relative;">');
        printWindow.document.write('<p style="margin-top: 0 !important; font-family: Verdana; text-align: center; font-size: 4mm; font-weight: bold;">' + desc + '</p>');
        printWindow.document.write('<img src="' + img.src + '" alt="QR Code" style="max-width: 40mm; display: block; margin: 0 auto; margin-top: 10px;">');
        printWindow.document.write('</div>');

        // Zamknięcie dokumentu
        printWindow.document.write('</body></html>');

        // Nasłuchiwanie na zdarzenie afterprint
        printWindow.addEventListener('afterprint', function () {
            // Zamknięcie okna podglądu po zakończeniu drukowania
            printWindow.close();
            closeMainContainer();
        });

        setTimeout(function () {
            printWindow.print();
        }, 100);
    }

    function closeMainContainer() {
        var mainContainer = document.getElementById('main-qrcode-container');
        if (mainContainer && document.body.contains(mainContainer)) {
            document.body.removeChild(mainContainer);
        } else {
            console.log('Nie znaleziono elementu o id "qrcode-container"');
        }
    }
}


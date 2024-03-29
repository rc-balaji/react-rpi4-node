import qrcode

# WiFi details
ssid = 'KRISHTEC'
password = 'KRISHtec@5747'
network_type = 'WPA'

# WiFi QR code data
wifi_qr_data = f'WIFI:T:{network_type};S:{ssid};P:{password};;'

# Generate WiFi QR code
wifi_qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
wifi_qr.add_data(wifi_qr_data)
wifi_qr.make(fit=True)

wifi_img = wifi_qr.make_image(fill_color="black", back_color="white")
wifi_img.save("wifi_qr.png")

# Website URL
website_url = 'http://192.168.1.45/'

# Generate Website QR code
website_qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
website_qr.add_data(website_url)
website_qr.make(fit=True)

website_img = website_qr.make_image(fill_color="black", back_color="white")
website_img.save("website_qr.png")

print("QR codes generated: wifi_qr.png and website_qr.png")

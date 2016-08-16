# Obtain SSL certificate with CSR

Instructions how to obtain SSL certificate and how to generate "Certificate Signing Request" (CSR) for SSL with OpenSSL:

* [Instructions for GeoTrust ](https://www.geotrust.com/resources/csr/apache_mod_ssl.htm)
* [Instructions for node.js](https://nodejs.org/api/tls.html#tls_tls_ssl)

## Certificate type

[GeoTrust RapidSSL (Single Domain)](https://www.ssls.com/geotrust-ssl-certificates/rapidssl.html)

## Domains

* www.trafficdefender.net
* t1.trdf.co
* t2.trdf.co
* err.trdf.co
* www.trdf.co
* api.trdf.co

## Instructions

Plese choose way for you: _easy_ or _complex_.

### 1. Easy way

All in one command. Please set up `DOMAIN=<domain>` and `EMAIL=<email_for_domain>` in command bellow.

	DOMAIN=<domain> ; EMAIL=<email_for_domain> ; openssl genrsa -out $DOMAIN.key 2048 && openssl req -new -key $DOMAIN.key -out $DOMAIN.csr -subj '/C=IL/ST=Tel Aviv/L=Tel Aviv/O=JavaBlue LTD/OU=Hosting/CN='$DOMAIN'/emailAddress='$EMAIL

Command already included information for CSR such as _Organization_ or _Email_.

### 2. Complex way

1. Generate RSA private key:

	openssl genrsa -out <domain>.key 2048

2. Create a CSR with the RSA private key (output will be PEM format):

	openssl req -new -key <domain>.key -out <domain>.csr

Enter next information for CSR:

	Common Name: <domain>
	Organization: JavaBlue LTD
	Organization Unit: Hosting
	Locality: Tel Aviv
	State: Tel Aviv
	Country: IL
	Email: support@trafficdefender.net (or support@trdf.co)

Do not enter extra attributes at the prompt.

__Warning__: Leave the challenge password blank.

## Extra steps

1. Verify the contents of the CSR.

	openssl req -noout -text -in <domain>.csr

2. Create a backup of your private key!

3. View the contents of the private key.

	openssl rsa -noout -text -in <domain>.key

## Submit

__Submit__ your CSR to Certification Center.


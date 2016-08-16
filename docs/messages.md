# Messages between clients and servers.

# Client <-> Server messages (websockets)

## Message

### Server -> Client

* **'message'**, `messageJson` - message to user about server error, warning,
information or debug.

### messageJson

	{
	  e: String, // error message
          w: String, // warning message
          i: String, // information
          d: String, // some debug
	  l: String, // link name
	  a: String, // link href
	}

## Dashboard

### Client -> Server

* Client request: **'get dashboard'**

	Server response: **'dashboard'**, `dashboardJson`

* Client request: **'add slot'**, `slotJson`

* Client request: **'edit slot'**, `slotJson`

* Client request: **'remove slot'**, `removeSlotsJson`

* Client request: **'generate script'**, `{ ids: [String] /* slots ids */ }`

	Server response: **'traffic script'**, `{ s: String /* traffic script */ }`

* Client request: **'actions'**, `actionsJson`

* Client request: **'get flags'**, `{ ids: [String]  /* slot ids */ }`

    	Server response: **'flags'**, 'flagsJson'

### Server -> Client

* Server sends automaticaly: **'update dashboard'**, `dashboardJson`

### dashboardJson

	{
	  tb: toolbarJson,
          s:  [slotJson],
          co: [contactJson],
	}

### toolbarJson

	{
          as:  Number,  // activeSlots
          ts:  Number,  // totalSlots
          cp:  String,  // user plan name
	  tr:  0|1,     // user.trial
          sms: Number,  // user.sms
        }

### slotJson

	{
          _id:  String,  // us._id,
          _nm:  String,  // us.name,
          _url: String,  // us.url,
          _ad:  Date,    // us.dateAdded,
          msw:  Number,  // main switch: us.active ? 1 : 0,
          fsw:  Number,  // flag switch ? 1 : 0,
          fms:  Number,  // current count of blocklists with flagged status
	  ftb:  Number,  // total flag blocklists
          ssw:  Number,  // server switch ? 1 : 0,
          sms:  Number,  // server switch
          tsw:  Number,  // traffic switch ? 1 : 0,
          tms:  Number,  // traffic status === 'ok' ? 1 : 0,
          tc:   Number,  // traffic counter: us.monitors.trafficmon.hits.allTime,
          _lv:  Date,    // us.monitors.trafficmon.lastVisitAt,
          _to:  Number,  // us.monitors.trafficmon.visitorInterval,
          _co:  [String],// [us.contactIds],
          nti:  Number,  // latestNotification.type: 0|1|2
          ntd:  Date,    // latestNotification.at:
        		 // 			flag:dateChanged |
        		 // 			server:dateChanged |
        		 // 			traffic:dateChanged
	}

### removeSlotsJson

	[{
          _id:  String,  // us._id,
          _nm:  String,  // us.name,
          _url: String,  // us.url,
	}, ... ]

### actionsJson

	{
	  action: String,  // 'activate' | 'deactivate'
	  ids: [String],   // slots ids
	}

### flagsJson

	[{
	  _id: String,   // us._id
	  ms: [{
	    nm: String, // monitor name
	    st: String, // monitor status
	    dt: Date,   // date changed
	  }]
	}]

## Contacts

### Client -> Server

* Client request: **'add contact'**, `contactJson`

* Client request: **'edit contact'**, `contactJson`

* Client request: **'remove contacts'**, `removeContactsJson`

* Client request: **'test contact'**, `testContactJson`

### contactJson

	{
          _id: String,  // contact._id
          nm:  String,  // contact.name
          ph:  String,  // contact.phone
          em:  String,  // contact.email
          nf:  Number,  // frequency.id => contact.notificationFrequency:
	                //            0 => "0"
	                //            1 => "5 minutes"
		        //	      2 => "15 minutes"
			//            3 => "30 minutes"
			//	      4 => "1 hours"
	  ed:  0|1      // editable (main contact is not ediable)
        }

### removeContactsJson

	[{
	  _id: String,  // contact._id
	  nm:  String,  // contact.name
	}, ... ]

### testContactJson

	{
	  _id: String,  // contact._id
	  tp:  Boolean, // test phone
	  te:  Boolean, // test email
	}

## Profile

### Client -> Server

* Client request: **'get profile'**

    Server response: **'profile'**, `profileJson`

* Client request: **'edit profile'**, `profileJson`

### Server -> Client

* Server sends automaticaly: **'profile updates'**, `profileJson`

### profileJson

	{
	  em: String[127], // email             [server->client]
	  cp: String,      // current password  [client->server]
	  ps: String,      // new password      [client->server]

	  un: String,      // username
	  ph: String[20],  // phone
	  ca: Date,        // createdAt         [server->client]
	  tz: String,      // timezone, ex. "Europe/Moscow"

	  pl: String,      // user plan name    [server->client]
	  tr: 0|1,         // trial		[server->client]
	  pd: 0|1,         // paid              [server->client]
	  es: Number,      // extraSlots        [server->client]
	  sm: Number,      // sms               [server->client]

	  fn: String,      // firstName
	  mn: String,      // middleName
	  ln: String,      // lastName
	  cm: String,      // company
	  ad: String[100], // address
	  a2: String[100], // address2
	  ci: String[50],  // city
	  st: String[100], // state
	  pc: String[20],  // postalCode
	  cc: String[2],   // countryCode
	}

## Timezones

### Client -> Server

* Client request: **'get timezones'**

    Server response: **'timezones'**, `timezonesArray`

### timezonesArray

	['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', ...]

### Packages

### Client - > Server

* Client request: **'get packages'**

    Server response: **'packages'**, `[ packageJson ]`

### packageJson

	{
          id: String,  // id, ex 'pro'
          nm: String,  // name, ex: 'Pro'
          pc: Number,  // price, ex: 149.99
          sl: Number,  // slots, ex: 20
          fl: Number,  // flag, 0|1
          sr: Number,  // server, 0|1
          tr: Number,  // traffic, 0|1
          cf: String,  // checkFrequency, ex: '1 minutes'
          sp: Number,  // slotPrice, ex: 9.99
	  sm: Number,  // smsOnStart (for Trial period), ex: 10
          pr: String,  // period, ex: '1 months'
	  ln: String,  // choose package link
	}

### Products

### Client - > Server

* Client request: **'get products'**

    Server response: **'products'**, `[ productJson ]`

### productJson

	{
	  id: String,  // id, ex: 'sms20'
	  tp: String,  // type, ex: 'sms'
          nm: String,  // name, ex: '20 SMS'
	  sm: Number,  // sms, ex: 20
	  cs: String,  // css class, ex: '.sms20'
          pc: Number,  // price, ex: 10.00
	  ln: String,  // choose product link
	}

### Services 

### Client - > Server

* Client request: **'get services'**

    Server response: **'services'**, `[ serviceJson ]`

### serviceJson

	{
	  id: String,  // id, ex: 'extraSlot5'
	  tp: String,  // type, ex: 'extraSlots'
          nm: String,  // name, ex: '5 extra slots'
          pc: Number,  // price, ex: 49.95
	  cn: Number,  // count, ex: 5
	  pd: String,  // period, ex: '1 months'
	  cs: String,  // css class, ex: '.extraSlot5'
	  ln: String,  // choose service link
	}

# traffic script messages (ajax)

## traffic script -> t1.trdf.co, t2.trdf.co

Page is opened message:

	{
	  k: String,  // urlstatus key
	  r: String,  // pseudo random visitKey
	  t: Date,    // visitAt
	  a: String,  // apiVersion
	  q: String,  // refererUrl
	}

Page is loaded message:

	{
	  k: String,  // urlstatus key
	  r: String,  // pseudo random visitKey
	  l: Number,  // loadedAfterMs
	}

Page is closed messge:

	{
	  k: String,  // urlstatus key
	  r: String,  // pseudo random visitKey
	  e: Number,  // closedAfterMs
	}

## traffic script -> err.trdf.co (ajax)

Error message:

	{
	  a: String,  // apiVersion
	  e: String,  // error, for ex. "1:1"
	  t: Date,    // visitAt,
	}

# Server -> Server messages (socket)

## t1.trdf.co, t2.trdf.co -> www.trafficdefender.net

Page is opened message:

	{
	  k:  String,  // urlstatus key
	  r:  String,  // pseudo random visitKey
	  t:  Date,    // visitAt
	  a:  String,  // apiVersion
	  q:  String,  // refererUrl
	  aa: Date,    // acceptAt;
	  vi: String,  // visitorIp;
	  ua: String,  // userAgent;
	}

Page is loaded message:

	{
	  k: String,  // urlstatus key
	  r: String,  // pseudo random visitKey
	  l: Number,  // loadedAfterMs
	}

Page is closed messge:

	{
	  k: String,  // urlstatus key
	  r: String,  // pseudo random visitKey
	  e: Number,  // closedAfterMs
	}



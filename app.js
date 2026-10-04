import * as E from './game.js';
import { CLUBS, FLAGS, NATIONS, POSITIONS, POS_NAMES, BY_ID, suggest, resolve, matches } from './game.js';
// Trifecta UI. Part 1 is the QR code encoder, part 2 is the game screens.

// ======== PART 1: QR CODE ENCODER (MIT licensed, Kazuhiko Arase) ========
/* QR encoder: QRCode for JavaScript, (c) 2009 Kazuhiko Arase, MIT license (http://www.opensource.org/licenses/mit-license.php).
   Bundled for the browser. Exposes window.TriQR.svg(text) */
(function(){
var __m={},__c={};
function __r(n){n=n.replace(/^\.\//,'');if(__c[n])return __c[n].exports;var m=__c[n]={exports:{}};__m[n](m,m.exports,__r);return m.exports;}
__m['QRMode']=function(module,exports,require){
module.exports = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};

};
__m['QRErrorCorrectLevel']=function(module,exports,require){
module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};


};
__m['QRMaskPattern']=function(module,exports,require){
module.exports = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

};
__m['QRMath']=function(module,exports,require){
var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

module.exports = QRMath;

};
__m['QRPolynomial']=function(module,exports,require){
var QRMath = require('./QRMath');

function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] === 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

module.exports = QRPolynomial;

};
__m['QRRSBlock']=function(module,exports,require){
var QRErrorCorrectLevel = require('./QRErrorCorrectLevel');

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = [];
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};

module.exports = QRRSBlock;

};
__m['QR8bitByte']=function(module,exports,require){
var QRMode = require('./QRMode');

function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function() {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

module.exports = QR8bitByte;

};
__m['QRBitBuffer']=function(module,exports,require){
function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

module.exports = QRBitBuffer;

};
__m['QRUtil']=function(module,exports,require){
var QRMode = require('./QRMode');
var QRPolynomial = require('./QRPolynomial');
var QRMath = require('./QRMath');
var QRMaskPattern = require('./QRMaskPattern');

var QRUtil = {

    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },

    getBCHDigit : function(data) {

        var digit = 0;

        while (data !== 0) {
            digit++;
            data >>>= 1;
        }

        return digit;
    },

    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
        
        switch (maskPattern) {
            
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;

        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

        var a = new QRPolynomial([1], 0);

        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }

        return a;
    },

    getLengthInBits : function(mode, type) {

        if (1 <= type && type < 10) {

            // 1 - 9

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 27) {

            // 10 - 26

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 41) {

            // 27 - 40

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + type);
        }
    },

    getLostPoint : function(qrCode) {
        
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;

        
        // LEVEL1
        
        for (row = 0; row < moduleCount; row++) {

            for (col = 0; col < moduleCount; col++) {

                var sameCount = 0;
                var dark = qrCode.isDark(row, col);

                for (var r = -1; r <= 1; r++) {

                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }

                    for (var c = -1; c <= 1; c++) {

                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }

                        if (r === 0 && c === 0) {
                            continue;
                        }

                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }

                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }

        // LEVEL2

        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }

        // LEVEL3

        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }

        // LEVEL4
        
        var darkCount = 0;

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;

        return lostPoint;       
    }

};

module.exports = QRUtil;

};
__m['index']=function(module,exports,require){
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
// Modified to work in node for this project (and some refactoring)
//---------------------------------------------------------------------

var QR8bitByte = require('./QR8bitByte');
var QRUtil = require('./QRUtil');
var QRPolynomial = require('./QRPolynomial');
var QRRSBlock = require('./QRRSBlock');
var QRBitBuffer = require('./QRBitBuffer');

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		// Calculate automatically typeNumber if provided is < 1
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}

				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new Array(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},
	
	createMovieClip : function(target_mc, instance_name, depth) {
	
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
	
		this.make();

		for (var row = 0; row < this.modules.length; row++) {
			
			var y = row * cs;
			
			for (var col = 0; col < this.modules[row].length; col++) {
	
				var x = col * cs;
				var dark = this.modules[row][col];
			
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		
		return qr_mc;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] !== null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
	
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
	
		// vertical		
		for (var v = 0; v < 15; v++) {
	
			mod = (!test && ( (bits >> v) & 1) === 1);
	
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
	
		// horizontal
		for (var h = 0; h < 15; h++) {
	
			mod = (!test && ( (bits >> h) & 1) === 1);
			
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col === 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] === null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}

	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}

	return data;

};

module.exports = QRCode;

};
var QRCode=__r('index'), EC=__r('QRErrorCorrectLevel');
window.TriQR={
  matrix:function(text){var q=new QRCode(-1,EC.M);q.addData(text);q.make();var n=q.getModuleCount(),m=[];for(var r=0;r<n;r++){m[r]=[];for(var c=0;c<n;c++)m[r][c]=q.isDark(r,c);}return m;},
  svg:function(text,px){var m=this.matrix(text),n=m.length,b=4,s='';for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(m[r][c])s+='M'+(c+b)+' '+(r+b)+'h1v1h-1z';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+2*b)+' '+(n+2*b)+'" width="'+(px||200)+'" height="'+(px||200)+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="'+s+'" fill="#2b2118"/></svg>';}
};
})();


// ======== PART 2: GAME SCREENS ========

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = (a, b) => a + Math.random() * (b - a);
const PCOL = ['var(--p0)', 'var(--p1)', 'var(--p2)'];
const BOTS = ['Coach Pep', 'Coach Jose', 'Coach Klopp', 'Coach Carlo', 'Coach Arsène', 'Coach Fergie', 'Coach Zizou'];
const LABEL = { club: 'Club', country: 'Country', pos: 'Position' };

const store = {
  get(k) { try { return localStorage.getItem('trifecta.' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('trifecta.' + k, v); } catch (e) { /* ignore */ } },
  del(k) { try { localStorage.removeItem('trifecta.' + k); } catch (e) { /* ignore */ } },
};

// ---------------- state ----------------
let screen = 'home'; // home | ai | local | online | lobby | game
let G = null;
let ctx = { kind: null, me: 0, offset: 0, code: null, token: null, msg: '', mt: 'info', ack: null, mkey: '' };
const F = { name: store.get('name') || '', opp: 1, diff: 'medium', n: 2, names: ['', '', ''], join: '', pickSec: 15 };
let planned = new Set();
let aiTimers = [];
let pollTimer = null;
let pollGen = 0;

const now = () => Date.now() + (ctx.offset || 0);
const nm = i => (G && G.players[i] && G.players[i].name) || 'Player ' + (i + 1);
const clubName = c => (CLUBS[c] || [c])[0];

// ---------------- small view helpers ----------------
function badge(code, small) {
  const c = CLUBS[code] || ['?', '#999', '#fff'];
  return `<span class="badge ${small ? 's' : ''}" style="background:${c[1]};color:${c[2]}">${esc(code)}</span>`;
}
function tile(slot, v, by, big) {
  const head = `<small>${LABEL[slot]}</small>`;
  if (!v) return `<div class="tile empty t-${slot}">${head}<div class="q">?</div><div class="by">Open</div></div>`;
  if (v === 'wait') return `<div class="tile empty t-${slot}">${head}<div class="q">…</div><div class="by">${esc(by)} is choosing</div></div>`;
  if (v === true) return `<div class="tile locked t-${slot}">${head}<div class="val">Chosen</div><div class="by">by ${esc(by)}</div></div>`;
  if (slot === 'club') return `<div class="tile t-${slot} ${big ? 'big' : ''}">${head}${badge(v)}<div class="val">${esc(clubName(v))}</div></div>`;
  if (slot === 'country') return `<div class="tile t-${slot} ${big ? 'big' : ''}">${head}<div class="flag">${FLAGS[v] || '🏳️'}</div><div class="val">${esc(v)}</div></div>`;
  return `<div class="tile t-${slot} ${big ? 'big' : ''}">${head}${pitchSVG(v, false)}<div class="val">${esc(POS_NAMES[v])}</div></div>`;
}

// Football pitch, attacking upwards. Interactive on the pick screen, a small marker in the clue tile.
const PITCH = { GK: [50, 119], LB: [15, 94], CB: [50, 98], RB: [85, 94], DM: [50, 77], CM: [50, 58], AM: [50, 41], LW: [15, 30], RW: [85, 30], ST: [50, 14] };
function pitchSVG(sel, interactive, okSet) {
  const stripes = Array.from({ length: 8 }, (_, i) => `<rect class="${i % 2 ? 'g2' : 'g1'}" x="0" y="${i * 16.25}" width="100" height="16.25"/>`).join('');
  const lines = '<rect class="ln" x="4" y="4" width="92" height="122"/><line class="ln" x1="4" y1="65" x2="96" y2="65"/><circle class="ln" cx="50" cy="65" r="10"/><rect class="ln" x="26" y="4" width="48" height="19"/><rect class="ln" x="38" y="4" width="24" height="8"/><rect class="ln" x="26" y="107" width="48" height="19"/><rect class="ln" x="38" y="118" width="24" height="8"/>';
  const spots = POSITIONS.map(k => {
    const [x, y] = PITCH[k];
    const on = sel === k;
    if (interactive && okSet && !okSet.has(k)) return `<g class="spot off" aria-disabled="true"><title>${esc(POS_NAMES[k])} (no player fits)</title><circle cx="${x}" cy="${y}" r="7.5"/><text x="${x}" y="${y}">${k}</text></g>`;
    if (interactive) return `<g class="spot ${on ? 'on' : ''}" data-act="pick" data-slot="pos" data-val="${k}" role="button" tabindex="0" aria-label="${esc(POS_NAMES[k])}"><title>${esc(POS_NAMES[k])}</title><circle cx="${x}" cy="${y}" r="7.5"/><text x="${x}" y="${y}">${k}</text></g>`;
    if (on) return `<g class="spot on"><circle cx="${x}" cy="${y}" r="8"/><text x="${x}" y="${y}">${k}</text></g>`;
    return `<g class="spot dim"><circle cx="${x}" cy="${y}" r="4"/></g>`;
  }).join('');
  return `<svg class="pitch ${interactive ? '' : 'mini'}" viewBox="0 0 100 130" role="img" aria-label="Football pitch${sel ? ', ' + esc(POS_NAMES[sel]) : ''}">${stripes}${lines}${spots}</svg>`;
}
function tiles(big) {
  const picking = G.phase === 'pick';
  const slots = picking ? E.ALL_SLOTS : G.slots;
  return `<div class="tiles">${slots.map(k => {
    const owner = G.claims ? G.claims[k] : undefined;
    let v = G.crit[k];
    if (picking) {
      if (owner === undefined) v = null;
      else if (v === undefined) v = 'wait'; // claimed, value not chosen yet
      else if (ctx.kind === 'local' || owner !== ctx.me) v = true; // other players' choices stay hidden
    }
    return tile(k, v, owner === undefined ? '' : nm(owner), big);
  }).join('')}</div>`;
}
function scoreboard() {
  return `<div class="scores">${G.players.map((p, i) => {
    const out = G.phase === 'answer' && G.locked.includes(i);
    const turn = G.phase === 'answer' && G.holder === i;
    const you = ctx.kind !== 'local' && i === ctx.me ? ' (you)' : '';
    return `<div class="chip ${out ? 'out' : ''} ${turn ? 'turn' : ''}" style="--c:${PCOL[i]}"><span class="dot"></span><span class="nm">${esc(p.name || '…')}${you}</span><b>${G.scores[i]}</b></div>`;
  }).join('')}</div>`;
}
function topbar(right) {
  return `<div class="top"><div class="brand"><i>3</i>Trifecta</div>${right || ''}</div>`;
}
function flash(text, type = 'info', html = false) {
  ctx.msg = text; ctx.mt = type; ctx.msgHtml = html;
  const el = $('.msg');
  if (el) { el.className = 'msg ' + type; if (html) el.innerHTML = text; else el.textContent = text; }
}

// ---------------- screens ----------------
function renderHome() {
  return `${topbar()}
  <div class="hero"><h1>Three clues.<br>One footballer.</h1>
  <p>Players call out a club, a country and, with three players, a position, all at the same moment. First to name a footballer who fits every clue takes the point. Ten rounds, most points wins.</p></div>
  <button class="card tap" data-act="nav" data-to="ai"><h3>🤖 Vs Computer</h3><p>Solo against one or two computer opponents. Pick a difficulty.</p></button>
  <button class="card tap" data-act="nav" data-to="online"><h3>🌐 Online</h3><p>Make a room, share the code or QR, and play from separate devices.</p></button>
  <button class="card tap" data-act="nav" data-to="local"><h3>👥 Pass and play</h3><p>Two or three people on one device, with buzzers.</p></button>
  <div class="card how"><h3>How a round works</h3><ol>
    <li>At the same time, every player chooses one clue to say: the <b>club</b>, the <b>country</b> or the <b>position</b> (picked on a pitch). Each clue can only be taken once, and you get 5 to 15 seconds.</li>
    <li>If the timer runs out on someone, they can restart it or take a random pick.</li>
    <li>The clues are revealed. Everyone races to name a footballer who has <b>played for that club</b>, is from that <b>country</b> and has <b>played that position</b>.</li>
    <li>A player who fits all clues wins the point. Naming someone who does not fit knocks you out of that round.</li>
    <li>Names we do not recognise cost nothing, and nobody can be used twice in a game.</li>
    <li>After 10 rounds the highest score wins. A tie goes to sudden death.</li></ol></div>`;
}

function timerSeg() {
  return `<label class="f">Clue timer</label><div class="seg">${[5, 7, 15].map(x => `<button class="${F.pickSec === x ? 'on' : ''}" data-act="form" data-k="pickSec" data-v="${x}">${x} sec</button>`).join('')}</div>`;
}

function renderAISetup() {
  const d = F.diff;
  return `${topbar('<button class="link" data-act="nav" data-to="home">Back</button>')}
  <div class="card"><h2>Vs Computer</h2>
  <label class="f">Your name</label><input class="in" data-form="name" value="${esc(F.name)}" maxlength="14" placeholder="You">
  <label class="f">Opponents</label>
  <div class="seg"><button class="${F.opp === 1 ? 'on' : ''}" data-act="form" data-k="opp" data-v="1">1 computer (2 players)</button><button class="${F.opp === 2 ? 'on' : ''}" data-act="form" data-k="opp" data-v="2">2 computers (3 players)</button></div>
  <label class="f">Difficulty</label>
  <div class="seg">${['easy', 'medium', 'hard'].map(x => `<button class="${d === x ? 'on' : ''}" data-act="form" data-k="diff" data-v="${x}">${x[0].toUpperCase() + x.slice(1)}</button>`).join('')}</div>
  ${timerSeg()}
  <p style="margin-top:12px">${F.opp === 2 ? 'Three players: each of you takes a different clue (club, country or position).' : 'Two players: each of you takes a different clue, so one of the three is left out.'} Everyone chooses at the same time.</p>
  <div style="margin-top:16px"><button class="btn" data-act="startAI">Kick off</button></div></div>`;
}

function renderLocalSetup() {
  const inputs = Array.from({ length: F.n }, (_, i) => `<label class="f">Player ${i + 1}</label><input class="in" data-form="names" data-i="${i}" value="${esc(F.names[i])}" maxlength="14" placeholder="Player ${i + 1}">`).join('');
  return `${topbar('<button class="link" data-act="nav" data-to="home">Back</button>')}
  <div class="card"><h2>Pass and play</h2>
  <label class="f">Players</label>
  <div class="seg"><button class="${F.n === 2 ? 'on' : ''}" data-act="form" data-k="n" data-v="2">2 players</button><button class="${F.n === 3 ? 'on' : ''}" data-act="form" data-k="n" data-v="3">3 players</button></div>
  ${inputs}
  ${timerSeg()}
  <p style="margin-top:12px">Each player secretly chooses a clue on their own turn (pass the device) before the timer runs out. Then everybody races: type the name or say it out loud. The first correct answer takes the point. A wrong answer knocks you out of the round.</p>
  <div style="margin-top:16px"><button class="btn" data-act="startLocal">Kick off</button></div></div>`;
}

function renderOnlineMenu() {
  return `${topbar('<button class="link" data-act="nav" data-to="home">Back</button>')}
  <div class="card"><h2>Online</h2>
  <label class="f">Your name</label><input class="in" data-form="name" value="${esc(F.name)}" maxlength="14" placeholder="You">
  <label class="f">Room size</label>
  <div class="seg"><button class="${F.n === 2 ? 'on' : ''}" data-act="form" data-k="n" data-v="2">2 players</button><button class="${F.n === 3 ? 'on' : ''}" data-act="form" data-k="n" data-v="3">3 players</button></div>
  ${timerSeg()}
  <div style="margin-top:14px"><button class="btn" data-act="createRoom">Create a room</button></div></div>
  <div class="card"><h3>Have a code?</h3>
  <input class="in" data-form="join" id="joincode" value="${esc(F.join)}" maxlength="4" placeholder="ABCD" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase;letter-spacing:.3em;font-weight:900;font-size:22px;text-align:center">
  <div style="margin-top:12px"><button class="btn dark" data-act="joinRoom">Join room</button></div>
  <div class="msg ${ctx.mt}">${esc(ctx.msg)}</div></div>`;
}

function roomLink() {
  return location.origin + location.pathname + '?room=' + ctx.code;
}

function renderLobby() {
  const host = ctx.me === 0;
  const full = G.players.every(p => p.name);
  const slots = G.players.map((p, i) => `<div class="slot ${p.name ? '' : 'empty'}" style="--c:${PCOL[i]}"><span class="dot"></span><span class="nm">${p.name ? esc(p.name) + (i === ctx.me ? ' (you)' : '') + (i === 0 ? ' · host' : '') : 'Waiting for player…'}</span>${host && i > 0 && p.name ? `<button class="btn alt sm" data-act="kick" data-i="${i}">Remove</button>` : ''}</div>`).join('');
  return `${topbar('<button class="link" data-act="leaveLobby">Leave</button>')}
  <div class="card"><label class="f" style="text-align:center;margin-top:0">Room code</label>
  <div class="code">${esc(ctx.code)}</div>
  <div class="qr">${window.TriQR ? window.TriQR.svg(roomLink(), 220) : ''}</div>
  <div class="row"><button class="btn alt sm" data-act="copyLink">Copy link</button><button class="btn alt sm" data-act="shareLink">Share</button></div></div>
  <div class="card stack"><h3>Players (${G.players.filter(p => p.name).length}/${G.n})</h3>${slots}
  ${host ? `<button class="btn" data-act="startOnline" ${full ? '' : 'disabled'}>${full ? 'Start game' : 'Waiting for players…'}</button>` : '<p>Waiting for the host to start.</p>'}
  <div class="msg ${ctx.mt}">${esc(ctx.msg)}</div></div>`;
}

function roundBar() {
  const sd = E.inSuddenDeath(G);
  const left = sd ? `<span class="sd">Sudden death · round ${G.round}</span>` : `Round ${G.round} of ${G.rounds}`;
  const clock = G.phase === 'answer' ? G.deadline : (G.phase === 'pick' && G.pickDeadline && !G.pickTimedOut ? G.pickDeadline : 0);
  const right = clock ? `<span data-until-text="${clock}">–</span>s left` : '';
  return `<div class="roundbar"><span>${left}</span><span>${right}</span></div>`;
}

function renderGame() {
  const leave = `<button class="link" data-act="home">${ctx.kind === 'online' ? 'Leave' : 'Quit'}</button>`;
  let h = topbar(leave);
  if (G.phase === 'over') return h + overView();
  h += roundBar() + scoreboard();
  if (G.phase === 'pick') h += pickView();
  else if (G.phase === 'answer') h += answerView();
  else if (G.phase === 'reveal') h += revealView();
  return h;
}

// ---- pick ----
const CAT_HINT = { club: 'I will name a club', country: 'I will name a country', pos: 'I will pick a position' };

function pickerUI(slot) {
  const okSet = okValues(slot);
  let items = '';
  if (slot === 'club') {
    items = Object.keys(CLUBS).filter(c => okSet.has(c)).sort((a, b) => clubName(a).localeCompare(clubName(b))).map(c =>
      `<button class="gbtn" data-act="pick" data-slot="club" data-val="${c}" data-q="${esc((clubName(c) + ' ' + c).toLowerCase())}">${badge(c, true)}<span>${esc(clubName(c))}</span></button>`).join('');
  } else if (slot === 'country') {
    items = NATIONS.filter(n => okSet.has(n)).map(n => `<button class="gbtn" data-act="pick" data-slot="country" data-val="${esc(n)}" data-q="${esc(n.toLowerCase())}"><span class="flag">${FLAGS[n] || '🏳️'}</span><span>${esc(n)}</span></button>`).join('');
  } else {
    return `${pitchSVG(null, true, okSet)}<div class="pitchcap">Tap the spot on the pitch.<br>DM defensive mid · CM central mid · AM attacking mid</div>
  <div style="margin-top:10px"><button class="btn alt" data-act="pickrandom" data-slot="pos">🎲 Surprise me</button></div>`;
  }
  const big = store.get('big') === '1';
  const search = slot === 'pos' ? '' : `<div class="searchrow"><input class="in" id="q" placeholder="Search ${slot === 'club' ? 'clubs' : 'countries'}…" autocomplete="off"><button class="btn alt sm" id="bigbtn" data-act="bigtoggle" aria-pressed="${big}">${big ? 'Smaller' : 'Enlarge'}</button></div>`;
  return `${search}<div class="grid${big ? ' big' : ''}" id="pickgrid">${items}</div>
  <div style="margin-top:10px"><button class="btn alt" data-act="pickrandom" data-slot="${slot}">🎲 Surprise me</button></div>`;
}

function pickTimer() {
  if (!G.pickDeadline) return '';
  return `<div class="bar"><i data-until="${G.pickTimedOut ? 0 : G.pickDeadline}" data-total="${G.pickMs}"></i></div>`;
}

function hasChosen(i) { return E.ALL_SLOTS.some(k => G.claims[k] === i && G.crit[k] !== undefined); }

// Values that still leave at least one possible footballer (online: sent by the server).
function okValues(slot) {
  if (ctx.kind === 'online') return new Set((G.valid && G.valid[slot]) || []);
  return new Set(E.validValues(G, ctx.kind === 'local' ? G.turn : ctx.me, slot));
}

function pickStatus() {
  return `<div class="status">${G.players.map((p, i) => hasChosen(i) ? `<span class="pill think">${esc(nm(i))} · chosen</span>` : `<span class="pill">${esc(nm(i))} · choosing…</span>`).join('')}</div>`;
}

function catChooser(who) {
  return `<div class="cats">${E.ALL_SLOTS.map(k => {
    const owner = G.claims[k];
    const taken = owner !== undefined && owner !== who;
    return `<button class="cat" data-act="chooseCat" data-slot="${k}" ${taken ? 'disabled' : ''}><b>${LABEL[k]}</b><small>${taken ? 'Taken by ' + esc(nm(owner)) : CAT_HINT[k]}</small></button>`;
  }).join('')}</div>`;
}

// Only shown once the clock has run out on someone who had not chosen yet.
function timeUpCard() {
  const missing = ctx.kind === 'local' ? [G.turn] : G.players.map((_, i) => i).filter(i => !hasChosen(i));
  return `<div class="card timeup"><h3>Time's up</h3><p>${esc(missing.map(nm).join(' and '))} ${missing.length > 1 ? "didn't" : "didn't"} choose in time.</p>
  <div class="row" style="margin-top:12px"><button class="btn" data-act="redo">↻ Restart timer</button><button class="btn alt" data-act="autofill">Pick randomly</button></div></div>`;
}

function pickView() {
  const local = ctx.kind === 'local';
  const who = local ? G.turn : ctx.me;
  if (local && !G.pickDeadline) {
    return tiles(false) + `<div class="card cover"><div class="big">Pass the device to ${esc(nm(who))}</div><p style="margin-bottom:16px">${esc(nm(who))} has ${G.pickMs / 1000} seconds to choose a club, a country or a position. Everyone else look away!</p><button class="btn" data-act="ack">I'm ${esc(nm(who))}</button></div>`;
  }
  let h = pickTimer() + tiles(false);
  if (G.pickTimedOut) h += timeUpCard();
  const mine = E.ALL_SLOTS.find(k => G.claims[k] === who);
  const mineDone = mine && G.crit[mine] !== undefined;
  const cat = ctx.cat || (mine && !mineDone ? mine : null);
  const lead = local ? esc(nm(who)) + ', c' : 'C';
  let body;
  if (cat && cat !== 'choose' && !(G.claims[cat] !== undefined && G.claims[cat] !== who)) {
    body = `<div class="row" style="margin-bottom:10px"><h3 style="flex:2">${lead}hoose the ${LABEL[cat].toLowerCase()}</h3><button class="btn alt sm" data-act="chooseCat" data-slot="choose">Change clue</button></div>${pickerUI(cat)}`;
  } else if (mineDone && cat !== 'choose') {
    body = `<h3>Locked in ✓</h3><p style="margin:4px 0 12px">Your ${LABEL[mine].toLowerCase()} stays hidden until everyone has chosen.</p><button class="btn alt sm" data-act="chooseCat" data-slot="choose">Change my pick</button>`;
  } else {
    body = `<h3 style="margin-bottom:4px">${local ? esc(nm(who)) + ', which' : 'Which'} clue will you say?</h3><p style="margin-bottom:12px">Everyone chooses at the same time, and each clue can only be taken once.</p>${catChooser(who)}`;
  }
  return h + `<div class="card">${body}<div class="msg ${ctx.mt}">${esc(ctx.msg)}</div></div>` + pickStatus();
}

// ---- voice ----
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const VOICE = { ok: !!SR, on: false, auto: store.get('voice') === '1', rec: null };

function voiceStop() {
  VOICE.on = false;
  if (VOICE.rec) { try { VOICE.rec.abort(); } catch (e) { /* ignore */ } VOICE.rec = null; }
  const b = $('.mic'); if (b) { b.classList.remove('live'); b.textContent = '🎙 Say it'; }
}

function voiceStart() {
  if (!VOICE.ok || VOICE.on) return;
  const rec = new SR();
  rec.lang = 'en-GB'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
  VOICE.rec = rec; VOICE.on = true;
  rec.onresult = ev => {
    const res = ev.results[ev.results.length - 1];
    const inp = $('#ans');
    if (inp) { inp.value = res[0].transcript; inp.dataset.id = ''; inp.dataset.name = ''; }
    if (!res.isFinal) return;
    // prefer a heard alternative that is a real player and fits the clues
    let best = null;
    for (let k = 0; k < res.length; k++) {
      const r = resolve(res[k].transcript);
      const p = r.player || (r.ambiguous && r.ambiguous.find(x => G && matches(x, G.crit)));
      if (!p) continue;
      if (!best) best = { p, t: res[k].transcript };
      if (G && matches(p, G.crit)) { best = { p, t: res[k].transcript }; break; }
    }
    voiceStop();
    if (!best) setTimeout(maybeVoice, 250);
    if (best && inp) { inp.value = best.p.name; inp.dataset.id = best.p.id; inp.dataset.name = best.p.name; submitAnswer(); }
    else { showSugg(); flash('Heard "' + res[0].transcript + '" but no match. Tap a name below, type it, or say it again.', 'bad'); }
  };
  rec.onerror = ev => {
    const bad = ev.error === 'not-allowed' || ev.error === 'service-not-allowed';
    voiceStop();
    if (bad) { VOICE.ok = false; flash('Microphone blocked. Allow it in your browser to use voice.', 'bad'); render(); }
    else if (ev.error !== 'aborted') flash("Didn't catch that. Tap Say it to try again.", 'info');
  };
  rec.onend = () => { if (VOICE.rec === rec) { voiceStop(); setTimeout(maybeVoice, 250); } };
  try { rec.start(); } catch (e) { voiceStop(); }
  const b = $('.mic'); if (b) { b.classList.add('live'); b.textContent = '🎙 Listening… tap to stop'; }
}

function maybeVoice() {
  const answering = screen === 'game' && G && G.phase === 'answer' && $('#ans');
  if (!answering) { if (VOICE.on) voiceStop(); return; }
  if (VOICE.auto && VOICE.ok && !VOICE.on) voiceStart();
}

// ---- answer ----
function statusPills() {
  return `<div class="status">${G.players.map((p, i) => {
    if (G.locked.includes(i)) return `<span class="pill out">${esc(nm(i))} · out</span>`;
    if (p.ai) return `<span class="pill think">${esc(nm(i))} · thinking…</span>`;
    return `<span class="pill">${esc(nm(i))} · in</span>`;
  }).join('')}</div>`;
}

function inputBox(label) {
  return `<div class="card">${label ? `<h3 style="margin-bottom:8px">${label}</h3>` : ''}<div class="ans"><input id="ans" class="in" autocomplete="off" autocapitalize="words" enterkeyhint="go" placeholder="Type a footballer's name…"><div id="sugg" class="sugg hide"></div></div>
  <div class="row" style="margin-top:10px"><button class="btn" data-act="submit">Answer</button>${micBtn()}<button class="btn alt" data-act="pass">Pass</button></div>
  ${VOICE.ok ? `<button class="link" data-act="voiceauto" style="display:block;margin:8px auto 0;text-decoration:underline">Voice: ${VOICE.auto ? 'on, always listening during the answer phase' : 'off'}</button>` : ''}
  <div class="msg ${ctx.mt}">${ctx.msgHtml ? ctx.msg : esc(ctx.msg)}</div></div>`;
}

function micBtn() {
  return VOICE.ok ? `<button class="btn alt mic ${VOICE.on ? 'live' : ''}" data-act="mic" type="button">${VOICE.on ? '🎙 Listening… tap to stop' : '🎙 Say it'}</button>` : '';
}

function answerView() {
  const total = G.mode === 'local' ? E.CFG.LOCAL_ANSWER_MS : E.CFG.ANSWER_MS;
  let h = tiles(true) + `<div class="bar"><i data-until="${G.deadline}" data-total="${total}"></i></div>`;
  const holderBar = `<div class="bar"><i data-until="${G.holderUntil}" data-total="${E.CFG.BUZZ_MS}" style="background:${PCOL[G.holder]}"></i></div>`;
  if (ctx.kind === 'local') {
    if (G.holder === null) {
      h += `<div class="buzzers" style="grid-template-columns:repeat(${G.n},1fr)">${G.players.map((p, i) => `<button class="buzz" style="--c:${PCOL[i]}" data-act="buzz" data-i="${i}" ${G.locked.includes(i) ? 'disabled' : ''}>${esc(p.name)}<br><small>${G.locked.includes(i) ? 'out' : 'BUZZ'}</small></button>`).join('')}</div>
      ${VOICE.ok ? `<button class="link" data-act="voiceauto" style="display:block;margin:6px auto;text-decoration:underline">Voice answers: ${VOICE.auto ? 'on (mic opens when you buzz)' : 'off'}</button>` : ''}
      <div class="msg ${ctx.mt}">${esc(ctx.msg)}</div>
      <button class="btn alt" data-act="giveup">Nobody knows — skip</button>`;
    } else {
      h += holderBar + inputBox(`${esc(nm(G.holder))}, your answer`);
    }
  } else if (G.locked.includes(ctx.me)) {
    h += `<div class="card"><h3>You're out this round</h3><p>You named someone who does not fit, or passed. Waiting for the others…</p><div class="msg ${ctx.mt}">${ctx.msgHtml ? ctx.msg : esc(ctx.msg)}</div></div>`;
  } else {
    h += inputBox('Who fits all three clues? Type it or say it.');
  }
  return h + statusPills();
}

// ---- reveal ----
function revealView() {
  const L = G.last;
  const p = L.playerId && BY_ID[L.playerId];
  let title;
  if (L.winner !== null && p) title = `<h2 class="win">${esc(nm(L.winner))} scores!</h2>`;
  else title = `<h2 class="none">${L.reason === 'timeout' ? "Time's up" : 'Nobody got it'}</h2>`;
  let card = '';
  if (p) {
    card = `<div class="pcard"><div class="nm">${esc(p.name)}</div><div class="sub">${FLAGS[p.nation] || ''} ${esc(p.nation)} · ${p.positions.join(', ')}</div><div class="clubs">${p.clubs.map(c => `<span class="cl ${c === L.crit.club ? 'hit' : ''}">${badge(c, true)}${esc(clubName(c))}</span>`).join('')}</div></div>`;
  }
  const ex = (L.examples || []).map(id => BY_ID[id]).filter(Boolean);
  const also = ex.length ? `<div class="also"><b>${p ? 'Also fits' : 'Could have been'}:</b> ${ex.map(x => esc(x.name)).join(', ')}</div>` : '';
  return `${tiles(false)}<div class="card result">${title}${card}${also}
  <div style="margin-top:14px"><button class="btn" data-act="next">Next round <span data-until-text="${G.nextAt}"></span></button></div></div>`;
}

// ---- over ----
function overView() {
  const w = G.winners || [];
  let head, sub = '';
  if (w.length > 1) { head = "It's a draw!"; sub = w.map(nm).join(' and ') + ' finish level.'; }
  else if (ctx.kind === 'local') head = `${esc(nm(w[0]))} wins!`;
  else head = w[0] === ctx.me ? 'You win!' : `${esc(nm(w[0]))} wins`;
  const emoji = w.length > 1 ? '🤝' : (ctx.kind !== 'local' && w[0] !== ctx.me ? '😤' : '🏆');
  const rows = G.log.map(l => `<tr><td>${l.round}</td><td>${G.slots.map(k => l.crit[k] ? (k === 'club' ? esc(clubName(l.crit[k])) : k === 'country' ? (FLAGS[l.crit[k]] || '') + ' ' + esc(l.crit[k]) : esc(l.crit[k])) : '').join(' · ')}</td><td>${l.winner === null ? '—' : esc(nm(l.winner))}</td><td>${l.playerId ? esc(BY_ID[l.playerId].name) : ''}</td></tr>`).join('');
  const again = ctx.kind === 'online'
    ? (ctx.me === 0 ? '<button class="btn" data-act="again">Rematch</button>' : '<p style="text-align:center">Waiting for the host to start a rematch…</p>')
    : '<button class="btn" data-act="again">Play again</button>';
  return `<div class="card final"><div class="trophy">${emoji}</div><h2>${head}</h2><p>${esc(sub)}</p><div style="margin-top:12px">${scoreboard()}</div></div>
  <div class="card"><h3 style="margin-bottom:8px">Round by round</h3><table class="log"><tr><th>#</th><th>Clues</th><th>Point</th><th>Answer</th></tr>${rows}</table></div>
  <div class="stack">${again}<button class="btn alt" data-act="home">Back to menu</button></div>`;
}

// ---------------- render ----------------
function render() {
  const key = G ? G.round + ':' + G.phase : '';
  if (key !== ctx.mkey) { ctx.mkey = key; ctx.cat = null; ctx.msg = ''; ctx.mt = 'info'; ctx.msgHtml = false; }
  const a = document.activeElement;
  const keep = a && a.id ? { id: a.id, v: a.value, s: a.selectionStart, e: a.selectionEnd, id2: a.dataset && a.dataset.id, nm2: a.dataset && a.dataset.name } : null;
  const html = screen === 'home' ? renderHome()
    : screen === 'ai' ? renderAISetup()
      : screen === 'local' ? renderLocalSetup()
        : screen === 'online' ? renderOnlineMenu()
          : screen === 'lobby' ? renderLobby()
            : renderGame();
  app.innerHTML = html;
  if (keep) {
    const el = document.getElementById(keep.id);
    if (el && 'value' in el) {
      el.value = keep.v;
      if (keep.id2) { el.dataset.id = keep.id2; el.dataset.name = keep.nm2; }
      try { el.focus(); el.setSelectionRange(keep.s, keep.e); } catch (e) { /* ignore */ }
    }
  } else if (screen === 'game' && $('#ans')) {
    $('#ans').focus();
  }
  updateTimers();
  maybeVoice();
  if (ctx.kind === 'ai') scheduleAI();
}

function updateTimers() {
  const t = now();
  $$('[data-until]').forEach(el => {
    const until = +el.dataset.until, total = +el.dataset.total;
    el.style.width = Math.max(0, Math.min(100, ((until - t) / total) * 100)) + '%';
  });
  $$('[data-until-text]').forEach(el => {
    const s = Math.max(0, Math.ceil((+el.dataset.untilText - t) / 1000));
    el.textContent = el.closest('button') ? `(${s})` : s;
  });
}

// ---------------- computer players ----------------
function after(ms, fn) { aiTimers.push(setTimeout(fn, Math.max(0, ms))); }
function clearAI() { aiTimers.forEach(clearTimeout); aiTimers = []; planned = new Set(); }

function scheduleAI() {
  if (ctx.kind !== 'ai' || !G) return;
  const round = G.round;
  if (G.phase === 'pick') {
    G.players.forEach((p, i) => {
      if (!p.ai || hasChosen(i)) return;
      const key = `p${round}:${i}`;
      if (planned.has(key)) return;
      planned.add(key);
      after(rnd(G.pickMs * 0.4, G.pickMs * 0.85), () => {
        if (!G || G.round !== round || G.phase !== 'pick' || hasChosen(i)) return;
        E.aiPick(G, i, Date.now());
        G.v++; render();
      });
    });
  } else if (G.phase === 'answer') {
    G.players.forEach((p, i) => {
      if (!p.ai || G.locked.includes(i)) return;
      const key = `a${round}:${i}`;
      if (planned.has(key)) return;
      planned.add(key);
      const plan = E.aiPlan(G, i, Date.now());
      if (!plan) return;
      after(plan.at - Date.now(), () => {
        if (!G || G.round !== round || G.phase !== 'answer' || G.locked.includes(i)) return;
        E.answer(G, i, { id: plan.id }, Date.now());
        G.v++; render();
      });
    });
  }
}

// ---------------- actions ----------------
function startGameLocal(kind, players, cfg) {
  clearAI(); stopPoll();
  ctx = { kind, me: 0, offset: 0, code: null, token: null, msg: '', mt: 'info', ack: null, mkey: '', cfg };
  G = E.newGame({ mode: kind === 'ai' ? 'ai' : 'local', players, pickMs: F.pickSec * 1000 });
  E.startGame(G, Date.now());
  screen = 'game';
  render();
}

function goHome() {
  clearAI(); stopPoll();
  if (ctx.kind === 'online') { store.del('session'); }
  G = null; ctx = { kind: null, me: 0, offset: 0, code: null, token: null, msg: '', mt: 'info', ack: null, mkey: '' };
  screen = 'home';
  history.replaceState(null, '', location.pathname);
  render();
}

async function doPick(slot, val) {
  const msgs = {
    nobody: 'Nobody in our database fits that together with the other clues. Try another.',
    taken: 'Someone already took that clue. Choose a different one.',
  };
  let r;
  if (ctx.kind === 'online') r = await api({ action: 'pick', slot, value: val });
  else {
    r = E.pick(G, ctx.kind === 'local' ? G.turn : ctx.me, slot, val, Date.now());
    if (r.ok) G.v++;
  }
  if (r.ok) { ctx.cat = null; render(); return; }
  if (r.error === 'taken') ctx.cat = 'choose';
  render();
  flash(msgs[r.error] || 'Could not lock that in.', 'bad');
}

function resultMsg(r, text) {
  if (r.ok && r.correct === false) { flash("That player doesn't fit all the clues. You're out this round.", 'bad'); return; }
  if (r.ok) return;
  const m = {
    notfound: ["We don't recognise that name. Check the spelling (no penalty).", 'bad'],
    used: ['That player was already used this game. Try someone else.', 'bad'],
    late: ['Too slow!', 'bad'],
    locked: ["You're out this round.", 'bad'],
    nobuzz: ['Hit your buzzer first.', 'bad'],
    held: ['Too slow, someone buzzed first.', 'bad'],
    net: ['Connection problem, try again.', 'bad'],
    taken: ['Someone already took that clue.', 'bad'],
  };
  if (r.error === 'ambiguous') {
    const opts = (r.options || []).map(id => BY_ID[id]).filter(Boolean);
    flash('Which one? ' + opts.map(o => `<button class="link" data-act="sugg" data-id="${o.id}" data-name="${esc(o.name)}" style="text-decoration:underline">${esc(o.name)}</button>`).join(' '), 'info', true);
    return;
  }
  const x = m[r.error] || ['Something went wrong.', 'bad'];
  flash(x[0], x[1]);
}

async function submitAnswer() {
  const inp = $('#ans');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  const payload = inp.dataset.id && inp.dataset.name === text ? { id: inp.dataset.id } : { text };
  let r;
  if (ctx.kind === 'online') r = await api({ action: 'answer', ...payload });
  else {
    r = E.answer(G, ctx.kind === 'local' ? G.holder : ctx.me, payload, Date.now());
    if (r.ok) { G.v++; render(); }
  }
  resultMsg(r, text);
  if (r.ok && r.correct === false) return;
  if (!r.ok) { const el = $('#ans'); if (el) el.select(); }
}

function showSugg() {
  const inp = $('#ans'), box = $('#sugg');
  if (!inp || !box) return;
  inp.dataset.id = ''; inp.dataset.name = '';
  const list = suggest(inp.value, 6);
  if (!list.length) { box.classList.add('hide'); box.innerHTML = ''; return; }
  box.innerHTML = list.map(p => `<button data-act="sugg" data-id="${p.id}" data-name="${esc(p.name)}"><span class="n">${esc(p.name)}</span><span class="m">${FLAGS[p.nation] || ''} ${p.positions[0]}</span></button>`).join('');
  box.classList.remove('hide');
}

const actions = {
  nav(el) { screen = el.dataset.to; ctx.msg = ''; render(); },
  home() { goHome(); },
  form(el) { const k = el.dataset.k; F[k] = k === 'diff' ? el.dataset.v : Number(el.dataset.v); render(); },
  startAI() {
    store.set('name', F.name);
    const pool = [...BOTS].sort(() => Math.random() - 0.5);
    const players = [{ name: F.name.trim() || 'You' }, ...Array.from({ length: F.opp }, (_, i) => ({ name: pool[i], ai: true, diff: F.diff }))];
    startGameLocal('ai', players, { kind: 'ai', players });
  },
  startLocal() {
    const players = Array.from({ length: F.n }, (_, i) => ({ name: (F.names[i] || '').trim() || 'Player ' + (i + 1) }));
    startGameLocal('local', players, { kind: 'local', players });
  },
  ack() { E.startTurn(G, G.turn, Date.now()); G.v++; render(); },
  async chooseCat(el) {
    const slot = el.dataset.slot || 'choose';
    ctx.msg = '';
    if (slot === 'choose') { ctx.cat = 'choose'; render(); return; }
    // the first player to tap a category owns it straight away
    let r;
    if (ctx.kind === 'online') r = await api({ action: 'claim', slot });
    else { r = E.claim(G, ctx.kind === 'local' ? G.turn : ctx.me, slot); if (r.ok) G.v++; }
    if (r.ok) { ctx.cat = slot; render(); return; }
    ctx.cat = 'choose'; render();
    if (r.error === 'taken') flash('Too slow, someone just took that category. Pick another.', 'bad');
  },
  async redo() {
    if (ctx.kind === 'online') { await api({ action: 'redo' }); return; }
    if (E.redoPick(G, ctx.me, Date.now()).ok) { G.v++; render(); }
  },
  async autofill() {
    if (ctx.kind === 'online') { await api({ action: 'autofill' }); return; }
    if (E.fillRandom(G, Date.now()).ok) { ctx.cat = null; G.v++; render(); }
  },
  pick(el) { doPick(el.dataset.slot, el.dataset.val); },
  pickrandom(el) {
    const slot = el.dataset.slot;
    const pool = [...okValues(slot)];
    if (!pool.length) { flash('No clue fits there.', 'bad'); return; }
    doPick(slot, pool[Math.floor(Math.random() * pool.length)]);
  },
  submit() { submitAnswer(); },
  sugg(el) {
    const inp = $('#ans');
    if (!inp) return;
    inp.value = el.dataset.name; inp.dataset.id = el.dataset.id; inp.dataset.name = el.dataset.name;
    const box = $('#sugg'); if (box) box.classList.add('hide');
    inp.focus();
  },
  async pass() {
    if (ctx.kind === 'online') { await api({ action: 'skip' }); return; }
    E.skip(G, ctx.kind === 'local' ? G.holder : ctx.me, Date.now()); G.v++; render();
  },
  buzz(el) {
    const i = Number(el.dataset.i);
    if (VOICE.auto && VOICE.ok && !VOICE.on) voiceStart();
    const r = E.buzz(G, i, Date.now());
    if (r.ok) { G.v++; render(); } else voiceStop();
  },
  mic() { if (VOICE.on) voiceStop(); else voiceStart(); },
  bigtoggle() { const on = store.get('big') !== '1'; store.set('big', on ? '1' : '0'); const g = $('#pickgrid'); if (g) g.classList.toggle('big', on); const b = $('#bigbtn'); if (b) { b.textContent = on ? 'Smaller' : 'Enlarge'; b.setAttribute('aria-pressed', String(on)); } },
  voiceauto() { VOICE.auto = !VOICE.auto; store.set('voice', VOICE.auto ? '1' : '0'); render(); },
  giveup() { for (let i = 0; i < G.n; i++) if (G.phase === 'answer') E.skip(G, i, Date.now()); G.v++; render(); },
  async next() {
    if (ctx.kind === 'online') { await api({ action: 'next' }); return; }
    E.next(G, Date.now()); G.v++; render();
  },
  async again() {
    if (ctx.kind === 'online') { await api({ action: 'rematch' }); return; }
    clearAI();
    startGameLocal(ctx.kind, ctx.cfg.players, ctx.cfg);
  },
  // online
  async createRoom() {
    store.set('name', F.name);
    try {
      const r = await fetch('/api/room', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'create', name: F.name, n: F.n, pickSec: F.pickSec }) }).then(x => x.json());
      if (!r.ok) { flash(r.message || 'Could not create a room.', 'bad'); return; }
      enterOnline(r);
    } catch (e) { flash('Could not reach the server.', 'bad'); }
  },
  async joinRoom() {
    store.set('name', F.name);
    const code = (F.join || '').toUpperCase().trim();
    if (code.length !== 4) { flash('Enter the 4-letter room code.', 'bad'); return; }
    try {
      const r = await fetch('/api/room', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'join', code, name: F.name }) }).then(x => x.json());
      if (!r.ok) {
        flash({ noroom: 'No room with that code.', full: 'That room is full.', started: 'That game has already started.' }[r.error] || r.message || 'Could not join.', 'bad');
        return;
      }
      enterOnline(r);
    } catch (e) { flash('Could not reach the server.', 'bad'); }
  },
  async startOnline() { await api({ action: 'start' }); },
  async kick(el) { await api({ action: 'kick', idx: Number(el.dataset.i) }); },
  async leaveLobby() { if (ctx.kind === 'online') await api({ action: 'leave' }); goHome(); },
  async copyLink() {
    try { await navigator.clipboard.writeText(roomLink()); flash('Link copied!', 'good'); } catch (e) { flash(roomLink(), 'info'); }
  },
  async shareLink() {
    if (navigator.share) { try { await navigator.share({ title: 'Trifecta', text: `Join my Trifecta game! Code: ${ctx.code}`, url: roomLink() }); } catch (e) { /* cancelled */ } }
    else actions.copyLink();
  },
};

app.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = actions[el.dataset.act];
  if (fn) fn(el);
});
app.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.form) {
    const k = t.dataset.form;
    if (k === 'names') F.names[Number(t.dataset.i)] = t.value;
    else if (k === 'join') { F.join = t.value.toUpperCase(); t.value = F.join; }
    else F[k] = t.value;
  } else if (t.id === 'ans') showSugg();
  else if (t.id === 'q') {
    const q = t.value.trim().toLowerCase();
    $$('#pickgrid .gbtn').forEach(b => b.classList.toggle('hide', !!q && !b.dataset.q.includes(q)));
  }
});
app.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'ans') { e.preventDefault(); const b = $('#sugg'); if (b) b.classList.add('hide'); submitAnswer(); }
  if (e.key === 'Enter' && e.target.id === 'joincode') actions.joinRoom();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('spot') && e.target.dataset.act) { e.preventDefault(); actions[e.target.dataset.act](e.target); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.ans')) { const b = $('#sugg'); if (b) b.classList.add('hide'); }
});

// ---------------- online ----------------
async function api(body) {
  try {
    const r = await fetch('/api/room', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: ctx.code, token: ctx.token, ...body }) }).then(x => x.json());
    if (r.state) applyState(r.state);
    if (!r.ok && (r.error === 'kicked' || r.error === 'noroom')) { leaveOnline(r.error === 'kicked' ? 'You were removed from the room.' : 'That room no longer exists.'); return r; }
    if (!r.ok && r.error !== 'nobody' && r.error !== 'taken') resultMsg(r);
    ctx.net = false;
    return r;
  } catch (e) {
    ctx.net = true; showNet();
    return { ok: false, error: 'net' };
  }
}

function showNet() {
  let n = $('#net');
  if (ctx.net && !n) { n = document.createElement('div'); n.id = 'net'; n.className = 'net'; n.textContent = 'Reconnecting…'; document.body.appendChild(n); }
  if (!ctx.net && n) n.remove();
}

function enterOnline(r) {
  clearAI(); stopPoll();
  ctx = { kind: 'online', me: r.idx ?? 0, offset: 0, code: r.code, token: r.token, msg: '', mt: 'info', ack: null, mkey: '' };
  store.set('session', JSON.stringify({ code: r.code, token: r.token }));
  G = null;
  applyState(r.state);
  history.replaceState(null, '', location.pathname);
  startPoll();
}

function applyState(st) {
  if (ctx.kind !== 'online') return;
  ctx.offset = st.now - Date.now();
  if (G && G.v === st.v && screen !== 'home') return;
  ctx.me = st.you;
  G = st;
  screen = st.phase === 'lobby' ? 'lobby' : 'game';
  render();
}

function leaveOnline(message) {
  stopPoll(); store.del('session');
  G = null;
  ctx = { kind: null, me: 0, offset: 0, code: null, token: null, msg: message || '', mt: 'bad', ack: null, mkey: '' };
  screen = 'online';
  render();
}

function startPoll() {
  stopPoll();
  const gen = pollGen;
  const loop = async () => {
    if (gen !== pollGen || ctx.kind !== 'online') return;
    try {
      const r = await fetch(`/api/room?code=${ctx.code}&token=${ctx.token}&v=${G ? G.v : -1}`).then(x => x.json());
      if (gen !== pollGen) return;
      ctx.net = false; showNet();
      if (r.ok && r.state) applyState(r.state);
      else if (r.ok && r.same) { ctx.offset = r.now - Date.now(); }
      else if (r.error === 'kicked') { leaveOnline('You were removed from the room.'); return; }
      else if (r.error === 'noroom') { leaveOnline('That room no longer exists.'); return; }
    } catch (e) { ctx.net = true; showNet(); }
    pollTimer = setTimeout(loop, G && G.phase === 'answer' ? 600 : 900);
  };
  pollTimer = setTimeout(loop, 500);
}
function stopPoll() { pollGen++; clearTimeout(pollTimer); pollTimer = null; ctx.net = false; showNet(); }

// ---------------- boot ----------------
setInterval(() => {
  if (G && (ctx.kind === 'ai' || ctx.kind === 'local') && screen === 'game') {
    if (E.tick(G, Date.now())) { G.v++; render(); return; }
  }
  updateTimers();
}, 250);

(async function boot() {
  const params = new URLSearchParams(location.search);
  const room = (params.get('room') || '').toUpperCase().slice(0, 4);
  let sess = null;
  try { sess = JSON.parse(store.get('session') || 'null'); } catch (e) { /* ignore */ }
  if (room && !(sess && sess.code === room)) {
    F.join = room; screen = 'online'; render(); return;
  }
  if (sess) {
    try {
      const r = await fetch(`/api/room?code=${sess.code}&token=${sess.token}&v=-1`).then(x => x.json());
      if (r.ok && r.state) {
        ctx = { kind: 'online', me: r.state.you, offset: 0, code: sess.code, token: sess.token, msg: '', mt: 'info', ack: null, mkey: '' };
        applyState(r.state); startPoll(); return;
      }
    } catch (e) { /* fall through */ }
    store.del('session');
  }
  render();
})();

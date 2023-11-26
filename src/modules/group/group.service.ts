import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { ClientTutorEntity } from './entities/client-tutor.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ShareDto } from './dto/share.dto';
import * as PDFDocument from 'pdfkit';
import { promises as fs } from 'fs';
import { bilets } from '../../common/constants/bilets.constant';

@Injectable()
export class GroupService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async share(shareDto: ShareDto) {
    const group_members = await ClientTutorEntity.find({
      where: {
        group_name: shareDto.group_name,
      },
    });
    console.log(shareDto);
    const admin = await UserEntity.findOneOrFail({
      where: {
        role: RoleEnum.ADMIN,
        telegram_nick: 'Skelet4on',
      },
    });
    await this.bot.telegram.sendMessage(admin?.telegram_id, shareDto.link);
    for (const member of group_members) {
      try {
        await this.bot.telegram.sendMessage(member.student, shareDto.link);
        console.log(
          member.student + ' ' + `${shareDto.link}` + ' ' + shareDto.group_name,
        );
      } catch (err) {
        const admin = await UserEntity.findOneOrFail({
          where: {
            role: RoleEnum.ADMIN,
            telegram_nick: 'Skelet4on',
          },
        });
        await this.bot.telegram.sendMessage(admin?.telegram_id, err.message);
      }
    }
  }
  async createGroups() {
    const managers = await UserEntity.find({
      where: { role: RoleEnum.MANAGER },
    });

    const users = await UserEntity.find({
      where: { role: RoleEnum.USER, verified: true },
    });

    const groups = [];

    const usersPerManager = Math.floor(users.length / managers.length);
    let remainingUsers = users.length % managers.length;

    for (let i = 0; i < managers.length; i++) {
      const manager = managers[i];
      const group = { manager: manager, users: [] };

      const numUsers = usersPerManager + (remainingUsers > 0 ? 1 : 0);
      group.users = users.splice(0, numUsers);
      remainingUsers--;

      groups.push(group);
    }

    for (const group of groups) {
      for (const user of group['users']) {
        try {
          const client_tutor = new ClientTutorEntity();
          client_tutor.group_name = group['manager'].firstname || 'magic';
          client_tutor.teacher = group['manager'].telegram_id;
          client_tutor.teacher_nick = group['manager'].telegram_nick;
          client_tutor.student = user.telegram_id;
          client_tutor.student_nick = user.telegram_nick;
          await client_tutor.save();
        } catch (err) {
          console.log(err.message);
        }
      }
    }
    return {
      message: 'Success',
    };
  }

  async createGroup(groupDto: CreateGroupDto) {
    try {
      const old_group = await ClientTutorEntity.find({
        where: { student: groupDto.student },
      });
      if (old_group.length > 0) throw 'Already in group';

      const client_tutor = new ClientTutorEntity();
      client_tutor.student = groupDto.student;
      client_tutor.student_nick = groupDto.student_nick;
      client_tutor.teacher = groupDto.teacher;
      client_tutor.teacher_nick = groupDto.teacher_nick;
      client_tutor.group_name = groupDto.group_name;
      await client_tutor.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async updateWithNumbers() {
    const numbers = {
      5671465913: 100,
      738096195: 101,
      755801711: 102,
      705024090: 103,
      994307985: 104,
      413391026: 105,
      1307183473: 106,
      621691103: 107,
      1860948411: 108,
      5788946967: 109,
      1219698142: 110,
      6976337586: 111,
      606017137: 112,
      6478591957: 113,
      1821040701: 114,
      1472557844: 115,
      5811463017: 116,
      5337552132: 117,
      5908029398: 118,
      1063421431: 119,
      908585694: 120,
      912899328: 121,
      5067063645: 122,
      960857186: 123,
      874379185: 124,
      5014695616: 125,
      756039469: 126,
      6901737736: 127,
      1594266158: 128,
      5518129305: 129,
      1402268073: 130,
      5317344095: 131,
      1104220213: 132,
      833938676: 133,
      6204036633: 134,
      5366431984: 135,
      763633169: 136,
      6615351462: 137,
      271938331: 138,
      1108757470: 139,
      6235792953: 140,
      1175216542: 141,
      832489672: 142,
      6383781256: 143,
      1840373362: 144,
      1977694933: 145,
      1136402103: 146,
      1424332178: 147,
      971290957: 148,
      766575131: 149,
      816206093: 150,
      1325465692: 151,
      2126820721: 152,
      533623883: 153,
      689641539: 154,
      6693390653: 155,
      960059582: 156,
      5142594525: 157,
      6855755078: 158,
      5803536615: 159,
      838448374: 160,
      1003117065: 161,
      864258208: 162,
      5706720909: 163,
      6806378959: 164,
      739218512: 165,
      799354180: 166,
      6223942769: 167,
      2091377232: 168,
      2004286472: 169,
      2136044351: 170,
      6015121301: 171,
      1224514653: 172,
      1721627132: 173,
      451568519: 174,
      5234200177: 175,
      6870536354: 176,
      221634722: 177,
      733808309: 178,
      520066302: 179,
      476815065: 180,
      793160408: 181,
      1381253309: 182,
      429905520: 183,
      444440663: 184,
      1054959983: 185,
      2145911738: 186,
      1492106752: 187,
      1405597315: 188,
      1035502774: 189,
      6081308629: 190,
      946800460: 191,
      1183081166: 192,
      605879267: 193,
      910289210: 194,
      1294593672: 195,
      667682090: 196,
      382801613: 197,
      659618528: 198,
      1543659609: 199,
      473880863: 200,
      803796597: 201,
      513352130: 202,
      6047846714: 203,
      6743990688: 204,
      861011018: 205,
      896896343: 206,
      5951764044: 207,
      738564481: 208,
      922505181: 209,
      779012963: 210,
      6824224108: 211,
      574947982: 212,
      293479873: 213,
      1257546539: 214,
      910575559: 215,
      935837719: 216,
      6300223704: 217,
      188522261: 218,
      5013221942: 219,
      905756719: 220,
      1122227391: 221,
      5589296744: 222,
      1872222795: 223,
      779206259: 224,
      1106944041: 225,
      1152633657: 226,
      1051270516: 227,
      6354808446: 228,
      431714794: 229,
      1264578239: 230,
      744135297: 231,
      493418668: 232,
      1959520976: 233,
      1384128183: 234,
      6155976363: 235,
      879889180: 236,
      829869767: 237,
      2112838207: 238,
      773164170: 239,
      1438676614: 240,
      5555059418: 241,
      879733594: 242,
      6542520027: 243,
      821161652: 244,
      739451970: 245,
      5334884206: 246,
      922725853: 247,
      1622967335: 248,
      1226620888: 249,
      1614379639: 250,
      6731964237: 251,
      6479488105: 252,
      6584745055: 253,
      670843864: 254,
      1238109743: 255,
      5476599115: 256,
      777842340: 257,
      5702959518: 258,
      5814712765: 259,
      826024008: 260,
      1238328077: 261,
      6558855542: 262,
      1017292796: 263,
      633026624: 264,
      5454360087: 265,
      1667864867: 266,
      488002624: 267,
      1468900959: 268,
      1252646875: 269,
      1927360224: 270,
      5401851604: 271,
      6794899966: 272,
      398985064: 273,
      1430202081: 274,
      6237454749: 275,
      832183129: 276,
      422525809: 277,
      5426038940: 278,
      1066003426: 279,
      1768089849: 280,
      6554596329: 281,
      5327525164: 282,
      84776410: 283,
      1207683905: 284,
      571067004: 285,
      344135815: 286,
      1057581850: 287,
      1628208343: 288,
      676598986: 289,
      5208909110: 290,
      923381435: 291,
      953437931: 292,
      1382189316: 293,
      764681374: 294,
      749570520: 295,
      5183105721: 296,
      2083162686: 297,
      1521727726: 298,
      5917361552: 299,
      5076331148: 300,
      856751305: 301,
      509124080: 302,
      5038462334: 303,
      1234223503: 304,
      6203646447: 305,
      1445706659: 306,
      637215382: 307,
      384900199: 308,
      1052171487: 309,
      1062659121: 310,
      1361333450: 311,
      1849753741: 312,
      672741325: 313,
      1022578486: 314,
      1254839973: 315,
      851846347: 316,
      1110477612: 317,
      5576076304: 318,
      1231813312: 319,
      5492433935: 320,
      415586998: 321,
      1027115742: 322,
      5089328981: 323,
      1156552007: 324,
      57944527: 325,
      1204130521: 326,
      1169751980: 327,
      984214329: 328,
      1490235182: 329,
      978522294: 330,
      1224337560: 331,
      457068305: 332,
      758032151: 333,
      1157063404: 334,
      768741340: 335,
      330387850: 336,
      1314532210: 337,
      1982764468: 338,
      582161564: 339,
      1003471679: 340,
      6283968855: 341,
      1245924827: 342,
      1981204095: 343,
      5028094481: 344,
      5972547103: 345,
      773855302: 346,
      6266696294: 347,
      974393657: 348,
      490104669: 349,
      800099811: 350,
      1702600766: 351,
      852171450: 352,
      1232435493: 353,
      560973705: 354,
      523693462: 355,
      2122762488: 356,
      744281176: 357,
      5960182147: 358,
      1103842727: 359,
      5535034177: 360,
      5321780617: 361,
      659713976: 362,
      2084841562: 363,
      361782661: 364,
      993764148: 365,
      5384482634: 366,
      6738635632: 367,
      1430709609: 368,
      1517323520: 369,
      5316568435: 370,
      5985899620: 371,
      1102327393: 372,
      5686078808: 373,
      650330390: 374,
      737788741: 375,
      5541093563: 376,
      472967355: 377,
      1271628975: 378,
      6491578377: 379,
      436921457: 380,
      667290325: 381,
      1019557280: 382,
      609948515: 383,
      6262024365: 384,
      819806506: 385,
      262552828: 386,
      1024506935: 387,
      2007532532: 388,
      1094940760: 389,
      5417049864: 390,
      1140494303: 391,
      884674706: 392,
      824232584: 393,
      612575411: 394,
      6610939909: 395,
      1111945281: 396,
      480710033: 397,
      1531852266: 398,
      787707998: 399,
      6704781320: 400,
      987102050: 401,
      5060708522: 402,
      5898922788: 403,
      5601051186: 404,
      1245691429: 405,
      842972311: 406,
      240446313: 407,
      1245864858: 408,
      6328564111: 409,
      1143600087: 410,
      5860371789: 411,
      1008595674: 412,
      5084780840: 413,
      1927958787: 414,
      616336758: 415,
      564568195: 416,
      6181879973: 417,
      1915683728: 418,
      875002858: 419,
      952539193: 420,
      751200173: 421,
      1077526417: 422,
      1713056342: 423,
      907382593: 424,
      1057144676: 425,
      1260396779: 426,
      1189959239: 427,
    };
    for (const [key, value] of Object.entries(numbers)) {
      try {
        const user = await UserEntity.findOne({ where: { telegram_id: key } });
        user.comp_number = value;
        await user.save();
        console.log(user.comp_number);
      } catch (e) {
        await this.bot.telegram.sendMessage(
          '860476763',
          e.message + ' ' + key + ' ' + 'Comp Num',
        );
      }
    }
  }

  async sendMessage() {
    const users = await UserEntity.find({ where: { verified: true } });
    for (const user of users) {
      try {
        if (
          user?.comp_number &&
          user?.comp_number >= 100 &&
          user?.comp_number <= 500
        ) {
          await this.bot.telegram.sendMessage(
            user.telegram_id,
            `Ваш уникальный номер для участье в розыгрыше: ${user.comp_number}. Он также будет виден в личном меню.`,
          );
        }
      } catch (e) {
        await this.bot.telegram.sendMessage(
          '860476763',
          e.message + ' ' + user.telegram_id + ' ' + 'Comp Num',
        );
      }
    }
  }

  async generatePDF(fio: string, student: string) {
    try {
      const pdfBuffer: Buffer = await new Promise((resolve) => {
        const doc = new PDFDocument({
          size: 'legal',
          bufferPages: true,
          layout: 'landscape',
        });

        // customize your PDF document

        doc.image('uploads/сертификат.png', 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
          align: 'center',
          valign: 'center',
        });
        doc
          .font('fonts/Alice-Regular.ttf')
          .fontSize(36)
          .fillOpacity(0.75)
          // .font('Times-Italic')
          .fillColor('white')
          .text(fio, 90, 300, { align: 'center' });
        doc.end();

        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });
      const filepath = `pdfs/${student.trim()}.pdf`;

      await fs.writeFile(filepath, pdfBuffer);

      return pdfBuffer;
    } catch (e) {
      throw e;
    }
  }

  async giveBilets() {
    for (const [key, value] of Object.entries(bilets)) {
      try {
        const user = await UserEntity.findOne({ where: { telegram_id: key } });
        user.tickets = value.join(',');
        await user.save();
        console.log(user.comp_number);
      } catch (e) {
        await this.bot.telegram.sendMessage(
          '860476763',
          e.message + ' ' + key + ' ' + 'Tickets',
        );
      }
    }
  }
}

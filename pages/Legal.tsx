import React, { useEffect } from 'react';
import { Shield, Lock, FileText, Scale } from 'lucide-react';

export const Legal: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-navy p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-brand-gold uppercase tracking-tight mb-4">
              Privacy Policy & Legal
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              ความโปร่งใสและความปลอดภัยคือหัวใจสำคัญของ Truvamate นโยบายนี้อธิบายถึงวิธีการที่เราดูแลข้อมูลของคุณและข้อตกลงทางกฎหมายในการใช้บริการ
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12">
          
          {/* Section 1: Privacy Policy */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center text-slate-900">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">1. นโยบายความเป็นส่วนตัว (Privacy Policy)</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                <strong>Truvamate Marketplace</strong> ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของคุณ เราเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อให้บริการที่ดีที่สุดแก่คุณ
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>ข้อมูลที่เรารวบรวม:</strong> ชื่อ, ที่อยู่, อีเมล, เบอร์โทรศัพท์ และข้อมูลการชำระเงินเมื่อคุณทำการสั่งซื้อ</li>
                <li><strong>การใช้ข้อมูล:</strong> เพื่อดำเนินการคำสั่งซื้อ, จัดส่งสินค้า, และแจ้งสถานะการสั่งซื้อ รวมถึงการแจ้งเตือนรางวัล Lotto</li>
                <li><strong>ความปลอดภัย:</strong> ข้อมูลบัตรเครดิตและธุรกรรมทางการเงินถูกเข้ารหัสด้วยมาตรฐาน SSL ระดับสากล เราไม่มีการจัดเก็บเลขบัตรเครดิตไว้ในเซิร์ฟเวอร์ของเรา</li>
                <li><strong>การแชร์ข้อมูล:</strong> เราอาจส่งข้อมูลที่อยู่ของคุณให้กับบริษัทขนส่ง (Logistics Partners) เพื่อการจัดส่งสินค้าเท่านั้น</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Terms of Service */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center text-slate-900">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">2. ข้อตกลงและเงื่อนไข (Terms of Service)</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                การใช้งานเว็บไซต์ Truvamate ถือว่าคุณยอมรับข้อตกลงดังต่อไปนี้:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">2.1 การซื้อสินค้า (Marketplace)</h3>
                  <p className="text-sm">สินค้าทั้งหมดเป็นสินค้านำเข้าจาก USA แท้ 100% ระยะเวลาจัดส่งอาจเปลี่ยนแปลงได้ตามสถานการณ์การขนส่งระหว่างประเทศ หากสินค้าชำรุดหรือเป็นของปลอม เรายินดีคืนเงินเต็มจำนวนภายใน 7 วัน</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">2.2 บริการ Lotto USA (Messenger Service)</h3>
                  <p className="text-sm">
                    Truvamate เป็นเพียงผู้ให้บริการ "ฝากซื้อ" (Messenger Service) เท่านั้น เราไม่ใช่ผู้ออกรางวัลและไม่มีส่วนเกี่ยวข้องกับกองสลากของสหรัฐอเมริกา (Official State Lotteries) 
                    <br/><br/>
                    - ผู้ซื้อต้องมีอายุ 20 ปีบริบูรณ์ขึ้นไป<br/>
                    - ตั๋วสลากตัวจริงจะถูกเก็บรักษาไว้ที่ตู้นิรภัยในสหรัฐอเมริกา<br/>
                    - หากถูกรางวัล เราจะดำเนินการประสานงานเพื่อขึ้นเงินรางวัลให้ โดยหักค่าธรรมเนียมการดำเนินการตามที่ตกลง
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Legal Compliance */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center text-slate-900">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">3. กฎหมายและการปฏิบัติตาม (Legal Compliance)</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
              <p>
                การดำเนินการของ Truvamate อยู่ภายใต้กฎหมายของประเทศไทยและข้อบังคับการค้าระหว่างประเทศ
              </p>
              <p>
                <strong>สินค้าต้องห้าม:</strong> เราไม่รับสั่งซื้อหรือนำเข้าสินค้าผิดกฎหมาย ยาเสพติด อาวุธ หรือสินค้าละเมิดลิขสิทธิ์ทุกประเภท หากตรวจสอบพบ เราขอยกเลิกคำสั่งซื้อและระงับบัญชีทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4: Contact */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center text-slate-900">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">4. เจ้าหน้าที่คุ้มครองข้อมูล (DPO)</h2>
            </div>
            <p className="text-slate-600">
              หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการลบข้อมูลบัญชีผู้ใช้ สามารถติดต่อเจ้าหน้าที่ของเราได้ที่:
            </p>
            <div className="mt-4 p-4 bg-brand-navy text-white rounded-lg inline-block">
              <p className="font-bold">Data Protection Office</p>
              <p className="text-sm opacity-80">Email: dpo@truvamate.com</p>
              <p className="text-sm opacity-80">Tel: 02-123-4567 (จันทร์-ศุกร์ 09:00 - 18:00)</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

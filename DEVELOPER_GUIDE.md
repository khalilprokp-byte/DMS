# 📝 دليل المطور - Driver Management System

## 🏗️ بنية المشروع

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # التخطيط الرئيسي
│   ├── page.tsx           # Dashboard الرئيسية
│   ├── drivers/           # صفحات السائقين
│   │   ├── page.tsx       # قائمة السائقين
│   │   └── [id]/
│   │       └── page.tsx   # ملف السائق الكامل
│   ├── companies/         # صفحات الشركات
│   │   └── page.tsx       # قائمة الشركات
│   ├── orders/            # إدارة الطلبات (قريباً)
│   ├── salaries/          # إدارة الرواتب (قريباً)
│   ├── advances/          # إدارة السلف (قريباً)
│   ├── reports/           # التقارير (قريباً)
│   └── settings/          # الإعدادات (قريباً)
│
├── components/            # المكونات المشتركة
│   ├── Sidebar.tsx       # القائمة الجانبية
│   ├── Header.tsx        # الهيدر العلوي
│   ├── StatsCard.tsx     # بطاقات الإحصائيات
│   ├── Modal.tsx         # النوافذ المنبثقة
│   └── LoadingSpinner.tsx # مؤشر التحميل
│
├── lib/                   # المكتبات والإعدادات
│   └── supabase.ts       # إعداد Supabase Client
│
├── types/                 # تعريفات TypeScript
│   └── index.ts          # جميع الأنواع والـ Enums
│
├── utils/                 # الدوال المساعدة
│   └── helpers.ts        # دوال التنسيق والحسابات
│
└── styles/                # الأنماط
    └── globals.css       # Tailwind CSS + أنماط مخصصة
```

## 🎨 نظام الألوان

```javascript
// Primary (الأزرق)
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  600: '#0284c7',    // الأساسي
  700: '#0369a1',
}

// Success (الأخضر)
success: {
  50: '#f0fdf4',
  100: '#dcfce7',
  600: '#16a34a',    // النجاح
  800: '#166534',
}

// Warning (البرتقالي/الأصفر)
warning: {
  50: '#fffbeb',
  100: '#fef3c7',
  600: '#d97706',    // التحذير
}

// Danger (الأحمر)
danger: {
  50: '#fef2f2',
  100: '#fee2e2',
  600: '#dc2626',    // الخطر
}
```

## 🧩 المكونات الأساسية

### StatsCard
```tsx
<StatsCard
  title="Total Revenue"
  value="£23,000"
  icon={<DollarSign />}
  color="blue"
  trend={{ value: 12.5, isPositive: true }}
/>
```

### Modal
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Add Driver"
  size="lg"
>
  {/* محتوى النافذة */}
</Modal>
```

### LoadingSpinner
```tsx
<LoadingSpinner size="md" />  // sm, md, lg
```

## 🔧 دوال مساعدة مهمة

### تنسيق العملة
```typescript
formatCurrency(120.50)  // "£120.50"
```

### تنسيق التاريخ
```typescript
formatDate("2024-01-15")  // "15 Jan 2024"
formatDateTime("2024-01-15T10:30:00Z")  // "15 Jan 2024, 10:30"
```

### حساب الراتب
```typescript
calculateSalary(
  totalOrders: 105,
  requiredOrders: 100,
  baseSalary: 120,
  isTraining: false
)
// Returns: { baseSalary: 120, bonus: 5, finalSalary: 125, needsWaive: false }
```

### رقم الأسبوع
```typescript
getWeekNumber(new Date())  // 51
getCurrentWeek()  // { weekNumber: 51, year: 2024 }
```

### رابط WhatsApp
```typescript
generateWhatsAppLink("+447700900123", "Hello!")
// "https://wa.me/447700900123?text=Hello!"
```

## 📊 منطق الأعمال

### حساب الراتب الأسبوعي

```typescript
// قواعد الراتب:
// 1. أول أسبوعين (Training): £0
// 2. أقل من 100 طلب: £0 (مع خيار التغاضي)
// 3. 100 طلب بالضبط: £120
// 4. أكثر من 100: £120 + £1 لكل طلب إضافي

function calculateWeeklySalary(driver: Driver, orders: Order[]) {
  const isTraining = isTrainingPeriod(driver.start_date)
  const totalOrders = orders.length
  const requiredOrders = driver.required_orders
  
  if (isTraining) {
    return { final: 0, bonus: 0, needsWaive: false }
  }
  
  if (totalOrders < requiredOrders) {
    // يحتاج قرار إداري
    return { final: 0, bonus: 0, needsWaive: true }
  }
  
  const bonus = totalOrders > requiredOrders 
    ? totalOrders - requiredOrders 
    : 0
    
  return {
    final: driver.weekly_salary + bonus,
    bonus,
    needsWaive: false
  }
}
```

### حساب الإيرادات من الطلبات

```typescript
function calculateOrderRevenue(
  order: Order, 
  company: Company
): number {
  if (company.pricing_type === 'per_order') {
    return company.price_value
  } else {
    // per_stop
    return company.price_value * order.stops
  }
}
```

### خصم السلف

```typescript
function deductAdvance(
  salary: number,
  advance: Advance
): number {
  const installment = advance.installment_amount || 0
  
  // لا يمكن أن يتجاوز الخصم الراتب
  return Math.min(installment, salary)
}
```

## 🔌 ربط Supabase

### استعلامات أساسية

```typescript
// جلب جميع السائقين
const { data: drivers, error } = await supabase
  .from('drivers')
  .select('*')
  .order('created_at', { ascending: false })

// جلب سائق واحد مع بياناته
const { data: driver } = await supabase
  .from('drivers')
  .select(`
    *,
    orders (*),
    weekly_salaries (*),
    advances (*)
  `)
  .eq('id', driverId)
  .single()

// إضافة سائق جديد
const { data, error } = await supabase
  .from('drivers')
  .insert({
    full_name: 'Ahmed Ali',
    phone: '+447700900123',
    whatsapp: '+447700900123',
    start_date: '2024-01-15',
    status: 'active',
    weekly_salary: 120,
    required_orders: 100
  })
  .select()

// تحديث بيانات سائق
const { error } = await supabase
  .from('drivers')
  .update({ status: 'suspended' })
  .eq('id', driverId)

// حذف سائق
const { error } = await supabase
  .from('drivers')
  .delete()
  .eq('id', driverId)
```

### رفع المستندات

```typescript
import { uploadFile } from '@/lib/supabase'

// رفع صورة هوية
const { url, error } = await uploadFile(
  'driver-documents',
  `drivers/${driverId}/identity-front.jpg`,
  file
)

if (!error) {
  // حفظ الرابط في قاعدة البيانات
  await supabase
    .from('drivers')
    .update({ identity_front: url })
    .eq('id', driverId)
}
```

## 📱 Responsive Design

المشروع مُصمم ليعمل على جميع الأحجام:

```css
/* Mobile First */
.container { /* الأساس */ }

/* Tablet */
@media (min-width: 640px) { /* sm: */ }
@media (min-width: 768px) { /* md: */ }

/* Desktop */
@media (min-width: 1024px) { /* lg: */ }
@media (min-width: 1280px) { /* xl: */ }
```

## 🚀 الخطوات التالية للتطوير

### 1. إدارة الطلبات (Orders)
- [ ] صفحة قائمة الطلبات
- [ ] نموذج إضافة طلب جديد
- [ ] حساب تلقائي للإيرادات
- [ ] تصفية حسب السائق/الشركة/التاريخ

### 2. إدارة الرواتب (Salaries)
- [ ] صفحة الرواتب الأسبوعية
- [ ] حساب تلقائي للرواتب
- [ ] نظام التغاضي مع الملاحظات
- [ ] أرشفة الأسابيع المكتملة

### 3. إدارة السلف (Advances)
- [ ] صفحة قائمة السلف
- [ ] إضافة سلفة جديدة
- [ ] خصم تلقائي من الرواتب
- [ ] تتبع الدفعات

### 4. التقارير (Reports)
- [ ] تقرير أسبوعي شامل
- [ ] تقرير شهري
- [ ] تقرير حسب السائق
- [ ] تقرير حسب الشركة
- [ ] تصدير PDF و Excel

### 5. المصادقة (Authentication)
- [ ] تسجيل دخول للمشرفين
- [ ] صلاحيات متعددة
- [ ] حماية الصفحات

### 6. تحسينات
- [ ] إشعارات في الوقت الفعلي
- [ ] نظام البحث الشامل
- [ ] تصدير البيانات
- [ ] نسخ احتياطي تلقائي
- [ ] وضع داكن (Dark Mode)
- [ ] دعم اللغة العربية بالكامل

## 🧪 الاختبار

```bash
# اختبار البناء
npm run build

# اختبار التطوير
npm run dev

# فحص الأخطاء
npm run lint
```

## 📚 موارد مفيدة

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Documentation](https://recharts.org/)

---

**Happy Coding! 💻**

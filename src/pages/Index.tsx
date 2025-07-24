import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'sushi' | 'pizza' | 'rolls';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  apartment: string;
  entrance: string;
  floor: string;
  intercom: string;
  comment: string;
  paymentMethod: 'cash' | 'card' | 'online';
  deliveryTime: 'asap' | 'scheduled';
  scheduledTime: string;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sushi' | 'rolls' | 'pizza'>('all');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap',
    scheduledTime: ''
  });
  const [errors, setErrors] = useState<Partial<OrderForm>>({});

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Лосось нигири',
      description: 'Свежий лосось на рисовой подушке',
      price: 120,
      category: 'sushi',
      image: '/img/08fdbaa0-2f2b-43d1-81d7-969140a14918.jpg'
    },
    {
      id: 2,
      name: 'Филадельфия ролл',
      description: 'Лосось, сливочный сыр, огурец',
      price: 350,
      category: 'rolls',
      image: '/img/08fdbaa0-2f2b-43d1-81d7-969140a14918.jpg'
    },
    {
      id: 3,
      name: 'Японская пицца',
      description: 'Лосось, нори, кунжут, соус унаги',
      price: 480,
      category: 'pizza',
      image: '/img/bb9fefb1-f936-4994-be61-91f751aea1b2.jpg'
    },
    {
      id: 4,
      name: 'Калифорния ролл',
      description: 'Краб, авокадо, огурец, икра тобико',
      price: 320,
      category: 'rolls',
      image: '/img/08fdbaa0-2f2b-43d1-81d7-969140a14918.jpg'
    },
    {
      id: 5,
      name: 'Тунец сашими',
      description: 'Свежайший тунец, васаби, имбирь',
      price: 280,
      category: 'sushi',
      image: '/img/08fdbaa0-2f2b-43d1-81d7-969140a14918.jpg'
    },
    {
      id: 6,
      name: 'Пицца Токио',
      description: 'Угорь, авокадо, кунжут, соус терияки',
      price: 520,
      category: 'pizza',
      image: '/img/bb9fefb1-f936-4994-be61-91f751aea1b2.jpg'
    }
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { id: 'all', name: 'Все', emoji: '🍽️' },
    { id: 'sushi', name: 'Суши', emoji: '🍣' },
    { id: 'rolls', name: 'Роллы', emoji: '🍱' },
    { id: 'pizza', name: 'Пицца', emoji: '🍕' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderForm> = {};
    
    if (!orderForm.name.trim()) newErrors.name = 'Имя обязательно';
    if (!orderForm.phone.trim()) newErrors.phone = 'Телефон обязателен';
    if (!orderForm.address.trim()) newErrors.address = 'Адрес обязателен';
    
    const phoneRegex = /^[+]?[7|8]?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    if (orderForm.phone && !phoneRegex.test(orderForm.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }
    
    if (orderForm.email && !/\S+@\S+\.\S+/.test(orderForm.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) return;
    
    // Здесь будет логика отправки заказа
    alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
    setIsOrderFormOpen(false);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🍣</div>
              <h1 className="text-2xl font-bold text-japanese-red">Sakura Sushi</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#menu" className="text-gray-700 hover:text-japanese-red transition-colors">Меню</a>
              <a href="#delivery" className="text-gray-700 hover:text-japanese-red transition-colors">Доставка</a>
              <a href="#about" className="text-gray-700 hover:text-japanese-red transition-colors">О нас</a>
              <a href="#contacts" className="text-gray-700 hover:text-japanese-red transition-colors">Контакты</a>
              <a href="#promotions" className="text-gray-700 hover:text-japanese-red transition-colors">Акции</a>
            </nav>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-japanese-red">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>Ваши выбранные блюда</SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.price}₽</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4 mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Итого:</span>
                          <span className="text-lg font-bold text-japanese-red">{totalPrice}₽</span>
                        </div>
                        <Button className="w-full bg-japanese-red hover:bg-red-700">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Искусство японской кухни</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Свежие суши, роллы и авторская пицца с японскими нотками. 
            Доставка по всему городу за 30 минут.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Icon name="ChefHat" size={24} className="mr-2" />
            Смотреть меню
          </Button>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Наше меню</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Отборные ингредиенты, традиционные рецепты и современные интерпретации японской кухни
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id as 'all' | 'sushi' | 'rolls' | 'pizza')}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'bg-japanese-red hover:bg-red-700 text-white shadow-lg scale-105' 
                      : 'border-japanese-red text-japanese-red hover:bg-japanese-red hover:text-white'
                  }`}
                >
                  <span className="mr-2 text-lg">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenuItems.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary" className="bg-japanese-gold/10 text-japanese-gold">
                      {item.category === 'sushi' ? 'Суши' :
                       item.category === 'rolls' ? 'Роллы' : 'Пицца'}
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-japanese-red">{item.price}₽</span>
                    <Button onClick={() => addToCart(item)} className="bg-japanese-red hover:bg-red-700">
                      <Icon name="Plus" size={16} className="mr-1" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section id="delivery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Доставка</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Icon name="Clock" size={48} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">30 минут</h4>
              <p className="text-gray-600">Среднее время доставки</p>
            </Card>
            
            <Card className="text-center p-6">
              <Icon name="MapPin" size={48} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">Вся Москва</h4>
              <p className="text-gray-600">Зона доставки</p>
            </Card>
            
            <Card className="text-center p-6">
              <Icon name="Truck" size={48} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">Бесплатно</h4>
              <p className="text-gray-600">При заказе от 1000₽</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-800 mb-6">О нас</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Sakura Sushi — это место, где традиции японской кухни встречаются с современными вкусами. 
                Наши шеф-повара используют только свежайшие ингредиенты и следуют аутентичным рецептам.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Мы также предлагаем уникальную пиццу в японском стиле — идеальное сочетание 
                итальянских традиций и восточных вкусов.
              </p>
              <Button size="lg" variant="outline" className="border-japanese-red text-japanese-red hover:bg-japanese-red hover:text-white">
                Узнать больше
              </Button>
            </div>
            <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <div className="text-8xl">🏮</div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section id="promotions" className="py-16 bg-gradient-to-r from-japanese-red to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8">Акции</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Счастливые часы</CardTitle>
                <CardDescription className="text-white/80">14:00 - 17:00</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Скидка 20% на все роллы</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Комбо предложение</CardTitle>
                <CardDescription className="text-white/80">Каждый день</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Ролл + пицца + напиток = 899₽</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Контакты</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Icon name="Phone" size={32} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">Телефон</h4>
              <p className="text-gray-600">+7 (495) 123-45-67</p>
            </Card>
            
            <Card className="text-center p-6">
              <Icon name="Mail" size={32} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">Email</h4>
              <p className="text-gray-600">info@sakura-sushi.ru</p>
            </Card>
            
            <Card className="text-center p-6">
              <Icon name="MapPin" size={32} className="mx-auto mb-4 text-japanese-red" />
              <h4 className="text-xl font-semibold mb-2">Адрес</h4>
              <p className="text-gray-600">ул. Тверская, 15, Москва</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-japanese-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">🍣</div>
            <span className="text-xl font-bold">Sakura Sushi</span>
          </div>
          <p className="text-gray-400">© 2024 Sakura Sushi. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
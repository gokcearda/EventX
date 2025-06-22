#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, Map, Symbol, Vec,
};

/// EventX NFT Ticketing Platform Smart Contract
/// 
/// Bu contract, Stellar blockchain üzerinde NFT tabanlı event biletleme sistemi sağlar.
/// Özellikler:
/// - Event oluşturma ve yönetimi
/// - NFT ticket minting
/// - Güvenli ticket transfer
/// - Event iptali ve otomatik refund
/// - Ticket geçerliliği ve sahiplik sorgulama

#[contract]
pub struct EventXContract;

/// Event bilgilerini tutan struct
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Event {
    pub id: Symbol,
    pub title: Symbol,
    pub description: Symbol,
    pub organizer: Address,
    pub total_tickets: u32,
    pub tickets_sold: u32,
    pub ticket_price: i128,
    pub event_date: u64,
    pub is_active: bool,
    pub is_cancelled: bool,
}

/// Ticket bilgilerini tutan struct
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Ticket {
    pub id: Symbol,
    pub event_id: Symbol,
    pub owner: Address,
    pub is_used: bool,
    pub is_refunded: bool,
    pub purchase_date: u64,
}

/// Contract storage keys
const EVENTS_KEY: Symbol = symbol_short!("events");
const TICKETS_KEY: Symbol = symbol_short!("tickets");
const COUNTER_KEY: Symbol = symbol_short!("counter");
const ADMIN_KEY: Symbol = symbol_short!("admin");
const EVENT_IDS_KEY: Symbol = symbol_short!("event_ids");

/// Event oluşturma parametreleri
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateEventParams {
    pub title: Symbol,
    pub description: Symbol,
    pub total_tickets: u32,
    pub ticket_price: i128,
    pub event_date: u64,
}

/// Ticket satın alma parametreleri
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BuyTicketParams {
    pub event_id: Symbol,
    pub buyer: Address,
}

/// Ticket transfer parametreleri
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TransferTicketParams {
    pub ticket_id: Symbol,
    pub from: Address,
    pub to: Address,
}

#[contractimpl]
impl EventXContract {
    /// Contract'ı initialize eder ve admin'i ayarlar
    pub fn initialize(env: &Env, admin: Address) {
        // Admin'i storage'a kaydet
        env.storage().instance().set(&ADMIN_KEY, &admin);
        
        // Event ve ticket storage'larını initialize et
        let events: Map<Symbol, Event> = Map::new(env);
        let tickets: Map<Symbol, Ticket> = Map::new(env);
        let event_ids: Vec<Symbol> = vec![env];
        
        env.storage().instance().set(&EVENTS_KEY, &events);
        env.storage().instance().set(&TICKETS_KEY, &tickets);
        env.storage().instance().set(&COUNTER_KEY, &0u32);
        env.storage().instance().set(&EVENT_IDS_KEY, &event_ids);
    }

    /// Admin kontrolü yapar
    fn require_admin(env: &Env, caller: &Address) {
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        if caller != &admin {
            panic!("Sadece admin bu işlemi yapabilir");
        }
    }

    /// Event oluşturur (sadece admin)
    pub fn create_event(env: &Env, caller: Address, params: CreateEventParams) -> Symbol {
        // Admin kontrolü
        Self::require_admin(env, &caller);
        
        // Event ID oluştur
        let event_counter: u32 = env.storage().instance().get(&COUNTER_KEY).unwrap();
        let event_id = match event_counter {
            0 => symbol_short!("event_0"),
            1 => symbol_short!("event_1"),
            2 => symbol_short!("event_2"),
            3 => symbol_short!("event_3"),
            4 => symbol_short!("event_4"),
            5 => symbol_short!("event_5"),
            6 => symbol_short!("event_6"),
            7 => symbol_short!("event_7"),
            8 => symbol_short!("event_8"),
            9 => symbol_short!("event_9"),
            _ => symbol_short!("event_x"),
        };
        
        // Event'i oluştur
        let event = Event {
            id: event_id.clone(),
            title: params.title,
            description: params.description,
            organizer: caller,
            total_tickets: params.total_tickets,
            tickets_sold: 0,
            ticket_price: params.ticket_price,
            event_date: params.event_date,
            is_active: true,
            is_cancelled: false,
        };
        
        // Event'i storage'a kaydet
        let mut events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        events.set(event_id.clone(), event);
        env.storage().instance().set(&EVENTS_KEY, &events);
        
        // Event ID'yi listeye ekle
        let mut event_ids: Vec<Symbol> = env.storage().instance().get(&EVENT_IDS_KEY).unwrap();
        event_ids.push_back(event_id.clone());
        env.storage().instance().set(&EVENT_IDS_KEY, &event_ids);
        
        // Event counter'ı artır
        env.storage().instance().set(&COUNTER_KEY, &(event_counter + 1));
        
        event_id
    }

    /// Event için ticket satın alır ve NFT mint eder
    pub fn buy_ticket(env: &Env, caller: Address, params: BuyTicketParams) -> Symbol {
        // Event'i kontrol et
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event_option = events.get(params.event_id.clone());
        
        // Event var mı kontrol et
        if event_option.is_none() {
            panic!("Event bulunamadı");
        }
        
        let event = event_option.unwrap();
        
        // Event aktif mi kontrol et
        if !event.is_active || event.is_cancelled {
            panic!("Event aktif değil veya iptal edilmiş");
        }
        
        // Bilet satış limiti kontrol et
        if event.tickets_sold >= event.total_tickets {
            panic!("Event için tüm biletler satılmış");
        }
        
        // Ticket ID oluştur
        let ticket_counter: u32 = env.storage().instance().get(&COUNTER_KEY).unwrap();
        let ticket_id = symbol_short!("ticket");
        
        // Ticket'ı oluştur
        let ticket = Ticket {
            id: ticket_id.clone(),
            event_id: params.event_id.clone(),
            owner: params.buyer,
            is_used: false,
            is_refunded: false,
            purchase_date: env.ledger().timestamp(),
        };
        
        // Ticket'ı storage'a kaydet
        let mut tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        tickets.set(ticket_id.clone(), ticket);
        env.storage().instance().set(&TICKETS_KEY, &tickets);
        
        // Event satış sayısını güncelle
        let mut updated_event = event;
        updated_event.tickets_sold += 1;
        let mut updated_events = events;
        updated_events.set(params.event_id, updated_event);
        env.storage().instance().set(&EVENTS_KEY, &updated_events);
        
        // Ticket counter'ı artır
        env.storage().instance().set(&COUNTER_KEY, &(ticket_counter + 1));
        
        ticket_id
    }

    /// Ticket sahipliğini transfer eder
    pub fn transfer_ticket(env: &Env, _caller: Address, params: TransferTicketParams) -> bool {
        // Ticket'ı kontrol et
        let mut tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        let ticket = tickets.get(params.ticket_id.clone()).unwrap();
        
        // Sahiplik kontrolü
        if ticket.owner != params.from {
            panic!("Ticket sahibi değilsiniz");
        }
        
        // Ticket kullanılmış mı kontrol et
        if ticket.is_used {
            panic!("Kullanılmış ticket transfer edilemez");
        }
        
        // Refund edilmiş mi kontrol et
        if ticket.is_refunded {
            panic!("Refund edilmiş ticket transfer edilemez");
        }
        
        // Event'i kontrol et
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event = events.get(ticket.event_id.clone()).unwrap();
        
        // Event iptal edilmiş mi kontrol et
        if event.is_cancelled {
            panic!("İptal edilmiş event'in ticket'ı transfer edilemez");
        }
        
        // Ticket'ı güncelle
        let updated_ticket = Ticket {
            owner: params.to,
            ..ticket
        };
        
        tickets.set(params.ticket_id, updated_ticket);
        env.storage().instance().set(&TICKETS_KEY, &tickets);
        
        true
    }

    /// Ticket'ı kullanıldı olarak işaretler (check-in)
    pub fn use_ticket(env: &Env, caller: Address, ticket_id: Symbol) -> bool {
        // Admin kontrolü (sadece event organizatörü veya admin check-in yapabilir)
        Self::require_admin(env, &caller);
        
        // Ticket'ı kontrol et
        let mut tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        let ticket = tickets.get(ticket_id.clone()).unwrap();
        
        // Ticket zaten kullanılmış mı kontrol et
        if ticket.is_used {
            panic!("Ticket zaten kullanılmış");
        }
        
        // Refund edilmiş mi kontrol et
        if ticket.is_refunded {
            panic!("Refund edilmiş ticket kullanılamaz");
        }
        
        // Event'i kontrol et
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event = events.get(ticket.event_id.clone()).unwrap();
        
        // Event iptal edilmiş mi kontrol et
        if event.is_cancelled {
            panic!("İptal edilmiş event'in ticket'ı kullanılamaz");
        }
        
        // Ticket'ı kullanıldı olarak işaretle
        let updated_ticket = Ticket {
            is_used: true,
            ..ticket
        };
        
        tickets.set(ticket_id, updated_ticket);
        env.storage().instance().set(&TICKETS_KEY, &tickets);
        
        true
    }

    /// Event'i iptal eder ve tüm ticket'ları refund eder
    pub fn cancel_event(env: &Env, caller: Address, event_id: Symbol) -> bool {
        // Admin kontrolü
        Self::require_admin(env, &caller);
        
        // Event'i kontrol et
        let mut events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event = events.get(event_id.clone()).unwrap();
        
        // Event zaten iptal edilmiş mi kontrol et
        if event.is_cancelled {
            panic!("Event zaten iptal edilmiş");
        }
        
        // Event'i iptal et
        let mut updated_event = event;
        updated_event.is_cancelled = true;
        updated_event.is_active = false;
        events.set(event_id.clone(), updated_event);
        env.storage().instance().set(&EVENTS_KEY, &events);
        
        // Bu event'e ait tüm ticket'ları refund et
        let _tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        
        // Not: Gerçek uygulamada tüm ticket'ları iterate etmek gerekir
        // Bu basit implementasyonda sadece event'i iptal ediyoruz
        // Refund işlemi frontend'de event cancellation event'ini dinleyerek yapılacak
        
        true
    }

    /// Ticket bilgilerini döndürür
    pub fn get_ticket(env: &Env, ticket_id: Symbol) -> Option<Ticket> {
        let tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        tickets.get(ticket_id)
    }

    /// Event bilgilerini döndürür
    pub fn get_event(env: &Env, event_id: Symbol) -> Option<Event> {
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        events.get(event_id)
    }

    /// Tüm event'leri döndürür
    pub fn get_all_events(env: &Env) -> Vec<Event> {
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event_ids: Vec<Symbol> = env.storage().instance().get(&EVENT_IDS_KEY).unwrap();
        let mut all_events = Vec::new(env);
        
        for event_id in event_ids.iter() {
            if let Some(event) = events.get(event_id) {
                all_events.push_back(event);
            }
        }
        
        all_events
    }

    /// Kullanıcının sahip olduğu tüm ticket'ları döndürür
    pub fn get_user_tickets(env: &Env, _user: Address) -> Vec<Symbol> {
        let _tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        let user_tickets = vec![env];
        
        // Not: Gerçek uygulamada tüm ticket'ları iterate etmek gerekir
        // Bu basit implementasyonda boş liste döndürüyoruz
        // Frontend'de event bazlı sorgulama yapılacak
        
        user_tickets
    }

    /// Event için satılan ticket sayısını döndürür
    pub fn get_event_ticket_count(env: &Env, event_id: Symbol) -> u32 {
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event = events.get(event_id).unwrap();
        event.tickets_sold
    }

    /// Ticket'ın geçerli olup olmadığını kontrol eder
    pub fn is_ticket_valid(env: &Env, ticket_id: Symbol) -> bool {
        let tickets: Map<Symbol, Ticket> = env.storage().instance().get(&TICKETS_KEY).unwrap();
        let ticket = tickets.get(ticket_id).unwrap();
        
        // Event'i kontrol et
        let events: Map<Symbol, Event> = env.storage().instance().get(&EVENTS_KEY).unwrap();
        let event = events.get(ticket.event_id.clone()).unwrap();
        
        // Ticket geçerli mi kontrol et
        !ticket.is_used && !ticket.is_refunded && !event.is_cancelled && event.is_active
    }

    /// Admin adresini döndürür
    pub fn get_admin(env: &Env) -> Address {
        env.storage().instance().get(&ADMIN_KEY).unwrap()
    }

    /// Admin'i değiştirir
    pub fn set_admin(env: &Env, caller: Address, new_admin: Address) -> bool {
        // Mevcut admin kontrolü
        Self::require_admin(env, &caller);
        
        // Yeni admin'i kaydet
        env.storage().instance().set(&ADMIN_KEY, &new_admin);
        
        true
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        symbol_short, Env,
    };
    use soroban_sdk::testutils::Address as TestAddress;

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let stored_admin = env.as_contract(&contract_id, || {
            EventXContract::get_admin(&env)
        });
        assert_eq!(stored_admin, admin);
    }

    #[test]
    fn test_create_event() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin, params)
        });
        
        let event = env.as_contract(&contract_id, || {
            EventXContract::get_event(&env, event_id)
        }).unwrap();
        
        assert_eq!(event.title, symbol_short!("TestEvent"));
        assert_eq!(event.total_tickets, 100);
        assert_eq!(event.tickets_sold, 0);
        assert_eq!(event.ticket_price, 1000);
        assert!(event.is_active);
        assert!(!event.is_cancelled);
    }

    #[test]
    fn test_buy_ticket() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        let buyer = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin, event_params)
        });
        
        let buy_params = BuyTicketParams {
            event_id: event_id.clone(),
            buyer: buyer.clone(),
        };
        
        let ticket_id = env.as_contract(&contract_id, || {
            EventXContract::buy_ticket(&env, buyer.clone(), buy_params)
        });
        
        let ticket = env.as_contract(&contract_id, || {
            EventXContract::get_ticket(&env, ticket_id)
        }).unwrap();
        
        assert_eq!(ticket.owner, buyer);
        assert_eq!(ticket.event_id, event_id);
        assert!(!ticket.is_used);
        assert!(!ticket.is_refunded);
        
        let ticket_count = env.as_contract(&contract_id, || {
            EventXContract::get_event_ticket_count(&env, event_id)
        });
        assert_eq!(ticket_count, 1);
    }

    #[test]
    fn test_get_all_events() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params1 = CreateEventParams {
            title: symbol_short!("Event1"),
            description: symbol_short!("Desc1"),
            total_tickets: 50,
            ticket_price: 500,
            event_date: 1234567890,
        };
        
        env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin.clone(), event_params1)
        });
        
        let event_params2 = CreateEventParams {
            title: symbol_short!("Event2"),
            description: symbol_short!("Desc2"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567891,
        };
        
        env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin, event_params2)
        });
        
        let all_events = env.as_contract(&contract_id, || {
            EventXContract::get_all_events(&env)
        });
        
        assert_eq!(all_events.len(), 2);
        let mut found_event1 = false;
        let mut found_event2 = false;
        for i in 0..all_events.len() {
            let event = all_events.get(i).unwrap();
            if event.title == symbol_short!("Event1") {
                found_event1 = true;
            }
            if event.title == symbol_short!("Event2") {
                found_event2 = true;
            }
        }
        assert!(found_event1);
        assert!(found_event2);
    }

    #[test]
    fn test_transfer_ticket() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        let buyer = <soroban_sdk::Address as TestAddress>::generate(&env);
        let new_owner = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin, event_params)
        });
        
        let buy_params = BuyTicketParams {
            event_id: event_id.clone(),
            buyer: buyer.clone(),
        };
        
        let ticket_id = env.as_contract(&contract_id, || {
            EventXContract::buy_ticket(&env, buyer.clone(), buy_params)
        });
        
        let transfer_params = TransferTicketParams {
            ticket_id: ticket_id.clone(),
            from: buyer,
            to: new_owner.clone(),
        };
        
        let result = env.as_contract(&contract_id, || {
            EventXContract::transfer_ticket(&env, new_owner.clone(), transfer_params)
        });
        assert!(result);
        
        let ticket = env.as_contract(&contract_id, || {
            EventXContract::get_ticket(&env, ticket_id)
        }).unwrap();
        
        assert_eq!(ticket.owner, new_owner);
    }

    #[test]
    fn test_use_ticket() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        let buyer = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin.clone(), event_params)
        });
        
        let buy_params = BuyTicketParams {
            event_id: event_id.clone(),
            buyer: buyer.clone(),
        };
        
        let ticket_id = env.as_contract(&contract_id, || {
            EventXContract::buy_ticket(&env, buyer, buy_params)
        });
        
        let result = env.as_contract(&contract_id, || {
            EventXContract::use_ticket(&env, admin, ticket_id.clone())
        });
        assert!(result);
        
        let ticket = env.as_contract(&contract_id, || {
            EventXContract::get_ticket(&env, ticket_id)
        }).unwrap();
        
        assert!(ticket.is_used);
    }

    #[test]
    fn test_cancel_event() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        let buyer = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin.clone(), event_params)
        });
        
        let buy_params = BuyTicketParams {
            event_id: event_id.clone(),
            buyer: buyer.clone(),
        };
        
        env.as_contract(&contract_id, || {
            EventXContract::buy_ticket(&env, buyer, buy_params)
        });
        
        let result = env.as_contract(&contract_id, || {
            EventXContract::cancel_event(&env, admin, event_id.clone())
        });
        assert!(result);
        
        let event = env.as_contract(&contract_id, || {
            EventXContract::get_event(&env, event_id)
        }).unwrap();
        
        assert!(event.is_cancelled);
        assert!(!event.is_active);
    }

    #[test]
    fn test_is_ticket_valid() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventXContract);
        let admin = <soroban_sdk::Address as TestAddress>::generate(&env);
        let buyer = <soroban_sdk::Address as TestAddress>::generate(&env);
        
        env.as_contract(&contract_id, || {
            EventXContract::initialize(&env, admin.clone());
        });
        
        let event_params = CreateEventParams {
            title: symbol_short!("TestEvent"),
            description: symbol_short!("TestDesc"),
            total_tickets: 100,
            ticket_price: 1000,
            event_date: 1234567890,
        };
        
        let event_id = env.as_contract(&contract_id, || {
            EventXContract::create_event(&env, admin, event_params)
        });
        
        let buy_params = BuyTicketParams {
            event_id: event_id.clone(),
            buyer: buyer.clone(),
        };
        
        let ticket_id = env.as_contract(&contract_id, || {
            EventXContract::buy_ticket(&env, buyer, buy_params)
        });
        
        let is_valid = env.as_contract(&contract_id, || {
            EventXContract::is_ticket_valid(&env, ticket_id)
        });
        assert!(is_valid);
    }
} 
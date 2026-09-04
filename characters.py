"""
Character classes for Star Wars LEGO Game
Defines Luke Skywalker, Rey, and other playable characters
"""

class Character:
    """Base character class"""
    
    def __init__(self, name, character_type):
        self.name = name
        self.character_type = character_type
        self.level = 1
        self.experience = 0
        self.health = 100
        self.max_health = 100
        self.position = [0, 0]  # [x, y]
        
        # Starting ability
        self.abilities = ["punch"]
        self.current_weapon = None
        self.unlocked_weapons = []
        
        # Stats
        self.attack_power = 10
        self.defense = 5
        self.speed = 5
        
        # Quests and progression
        self.completed_quests = []
        self.active_quests = []
        self.inventory = []
        
    def punch(self):
        """Base punch attack"""
        damage = self.attack_power
        return {
            "ability": "punch",
            "damage": damage,
            "range": 1,
            "animation_frames": 4
        }
    
    def move(self, direction):
        """Move character in direction: 'up', 'down', 'left', 'right'"""
        if direction == "up":
            self.position[1] += self.speed
        elif direction == "down":
            self.position[1] -= self.speed
        elif direction == "left":
            self.position[0] -= self.speed
        elif direction == "right":
            self.position[0] += self.speed
    
    def take_damage(self, damage):
        """Take damage from enemies or attacks"""
        actual_damage = max(1, damage - self.defense)
        self.health -= actual_damage
        return actual_damage
    
    def heal(self, amount):
        """Heal character"""
        self.health = min(self.max_health, self.health + amount)
    
    def gain_experience(self, amount):
        """Gain experience points"""
        self.experience += amount
        if self.experience >= 100:  # Level up at 100 XP
            self.level_up()
    
    def level_up(self):
        """Level up character"""
        self.level += 1
        self.experience = 0
        self.max_health += 10
        self.health = self.max_health
        self.attack_power += 2
        self.defense += 1
    
    def unlock_weapon(self, weapon):
        """Unlock a new weapon"""
        if weapon not in self.unlocked_weapons:
            self.unlocked_weapons.append(weapon)
            self.abilities.append(weapon.ability_name)
            print(f"{self.name} unlocked {weapon.name}!")
    
    def equip_weapon(self, weapon_name):
        """Equip a weapon from unlocked weapons"""
        for weapon in self.unlocked_weapons:
            if weapon.name == weapon_name:
                self.current_weapon = weapon
                return True
        return False
    
    def attack(self):
        """Perform an attack with current weapon or punch"""
        if self.current_weapon:
            return self.current_weapon.attack(self.attack_power)
        else:
            return self.punch()
    
    def complete_quest(self, quest):
        """Complete a quest"""
        if quest not in self.completed_quests:
            self.completed_quests.append(quest)
            self.gain_experience(quest.reward_xp)
            for item in quest.reward_items:
                self.inventory.append(item)


class Luke(Character):
    """Luke Skywalker character"""
    
    def __init__(self):
        super().__init__("Luke Skywalker", "jedi")
        self.max_health = 120
        self.health = 120
        self.attack_power = 12
        self.defense = 6
        self.speed = 5
        self.backstory = "A young Jedi Knight seeking to restore peace to the galaxy"
        self.character_model = "luke"  # For sprite reference


class Rey(Character):
    """Rey character"""
    
    def __init__(self):
        super().__init__("Rey", "jedi")
        self.max_health = 110
        self.health = 110
        self.attack_power = 13
        self.defense = 5
        self.speed = 6
        self.backstory = "A scavenger turned Jedi with untapped Force potential"
        self.character_model = "rey"  # For sprite reference


class Leia(Character):
    """Princess Leia character"""
    
    def __init__(self):
        super().__init__("Princess Leia", "commander")
        self.max_health = 90
        self.health = 90
        self.attack_power = 10
        self.defense = 4
        self.speed = 5
        self.backstory = "The leader of the Rebellion fighting against tyranny"
        self.character_model = "leia"  # For sprite reference


class Chewbacca(Character):
    """Chewbacca character"""
    
    def __init__(self):
        super().__init__("Chewbacca", "wookiee")
        self.max_health = 140
        self.health = 140
        self.attack_power = 15
        self.defense = 7
        self.speed = 4
        self.backstory = "A fierce Wookiee with incredible strength"
        self.character_model = "chewbacca"  # For sprite reference

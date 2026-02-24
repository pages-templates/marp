---
marp: true
theme: uncover
class: lead
title: Object-Oriented Programming in C#
paginate: true
---

# 🧠 Object-Oriented Programming

A quick dive into OOP principles in **C#**.

---

## ⚙️ Core Concepts

- Encapsulation
- Inheritance
- Polymorphism
- Abstraction

---

## 🧩 Example

```csharp
public class Animal {
    public virtual void Speak() => Console.WriteLine("Sound!");
}

public class Dog : Animal {
    public override void Speak() => Console.WriteLine("Woof!");
}
```

# 🎨 Decart MirageLSD - Visual Consistency Guide

## 🎯 Purpose
This guide ensures **consistent, beautiful, and subtle** visual transformations using Decart's MirageLSD technology. The goal is to enhance the experience **without overwhelming it**.

---

## ⚖️ The Golden Rule: **Subtlety Over Spectacle**

MirageLSD is powerful - it can completely transform a scene. But for immersive language learning, we want:
- ✅ **Enhancement** not **replacement**
- ✅ **Atmosphere** not **distraction**
- ✅ **Consistency** not **chaos**
- ✅ **Recognizable** not **abstract**

---

## 📐 Prompt Engineering Principles

### **1. Structure Your Prompts Like This:**

```
[Artistic Style] + [Lighting Quality] + [Color Palette] + [Atmosphere] + [Cultural Details] + [Consistency Anchors]
```

**Example (Good):**
```
Soft warm impressionist style, 
gentle golden morning light through lace curtains, 
subtle Monet-inspired brushstrokes, 
creamy beiges and warm honey tones, 
cozy intimate Parisian atmosphere, 
soft focus on edges, 
painterly but recognizable, 
calm and inviting
```

**Example (Bad - Too Intense):**
```
Extreme Van Gogh swirls, vibrant neon colors, abstract cubist shapes
```

---

### **2. Key Modifiers for Consistency:**

| Modifier | Purpose | Example |
|----------|---------|---------|
| **"Soft"** | Reduces intensity | "soft impressionist style" |
| **"Subtle"** | Prevents over-processing | "subtle brushstrokes" |
| **"Gentle"** | Smooths transitions | "gentle golden light" |
| **"Painterly but recognizable"** | Maintains clarity | Essential for gameplay |
| **"Calm and inviting"** | Sets mood anchor | Emotional consistency |
| **"Warm honey tones"** | Color temperature lock | Prevents wild color shifts |

---

### **3. Lighting is Key for Consistency:**

Lighting creates **90% of atmosphere** and helps Decart maintain stability.

**Good Lighting Descriptions:**
- ✅ "Gentle golden morning light streaming through windows"
- ✅ "Soft warm Edison bulb glow, amber tones"
- ✅ "Dappled afternoon sunlight, warm and relaxed"
- ✅ "Cozy evening lamplight, intimate and soft"

**Bad Lighting Descriptions:**
- ❌ "Crazy disco lights"
- ❌ "Rainbow explosions"
- ❌ "Harsh strobe effects"

---

### **4. Color Palette Anchors:**

Always specify **3-5 core colors** to prevent wild shifts:

**French Bakery Example:**
```
creamy beiges, warm honey tones, soft golden yellows, 
buttery pastels, gentle ivory whites
```

**Key Techniques:**
- Use **warm** or **cool** to lock temperature
- Use **muted**, **soft**, **gentle** to reduce saturation
- Reference **real materials**: "honey", "cream", "butter", "terracotta"

---

### **5. Artistic Style References:**

Choose artists known for **subtlety and consistency**:

| Scenario | Good Artist References | Why |
|----------|----------------------|-----|
| French Bakery | Monet, Renoir, Bonnard | Soft impressionism, warm tones |
| Tea House | Sumi-e, Hiroshige | Minimal, zen, consistent |
| Italian Café | Caravaggio lighting | Dramatic but controlled |
| Spanish Tapas | Sorolla | Warm Mediterranean light |

**Avoid:** Picasso, Dalí, Bacon (too abstract/distorted)

---

## 🎨 Scenario-Specific Templates

### **French Boulangerie (Optimal)**
```javascript
prompt: "Soft warm impressionist style, gentle golden morning light through lace curtains, subtle Monet-inspired brushstrokes, creamy beiges and warm honey tones, cozy intimate Parisian atmosphere, soft focus on edges, painterly but recognizable, calm and inviting"

strength: 0.6-0.7  // Moderate transformation
consistency: "high"  // Prioritize stability
```

**Why it works:**
- Locks warm color temperature
- References specific artist style (Monet)
- Uses multiple "soft/gentle/subtle" modifiers
- Maintains "recognizable" anchor
- Evokes emotion without chaos

---

### **German Berghain (Club)**
```javascript
prompt: "Dark industrial atmosphere, subtle cyberpunk aesthetic, controlled neon accents in blues and magentas, brutalist concrete textures, cinematic Blade Runner mood, dramatic shadows with detail, moody but navigable, consistent low-key lighting"

strength: 0.5-0.6  // Subdued for dark scenes
consistency: "very-high"  // Dark scenes need stability
```

---

### **Chinese Tea House**
```javascript
prompt: "Traditional sumi-e ink wash painting style, soft misty atmosphere, minimalist zen aesthetic, gentle gradient washes, muted earth tones and jade greens, serene and meditative, watercolor softness, recognizable forms, peaceful continuity"

strength: 0.6-0.7
consistency: "high"
```

---

### **Japanese Izakaya**
```javascript
prompt: "Warm Studio Ghibli inspired atmosphere, soft orange lantern glow, cozy evening ambiance, gentle anime aesthetic, warm amber and soft reds, intimate and inviting, painterly but clear, nostalgic and comforting"

strength: 0.65-0.75
consistency: "high"
```

---

## 🔧 Technical Parameters

### **Strength Settings (0.0 - 1.0):**

| Strength | Effect | Best For |
|----------|--------|----------|
| 0.3-0.4 | Very subtle | Beginners, first-time users |
| 0.5-0.6 | Noticeable but balanced | Most scenarios ✅ |
| 0.7-0.8 | Strong transformation | Artistic emphasis |
| 0.9-1.0 | Extreme stylization | Avoid for gameplay |

**Recommendation:** Start at **0.6** and adjust based on user feedback.

---

### **Consistency Settings:**

```javascript
{
  consistency: "very-high",  // Minimal frame-to-frame variation
  smoothing: true,           // Temporal smoothing
  stabilization: "enabled"   // Reduce flickering
}
```

---

## 🎬 Frame-to-Frame Consistency Tips

### **Problem: Flickering/Shifting**
**Solution:**
- Use **temporal consistency** keywords: "continuous", "stable", "consistent"
- Avoid dynamic words: "changing", "evolving", "transforming"
- Lock in 3-5 core colors
- Use "gentle transitions" modifier

### **Problem: Over-stylization**
**Solution:**
- Add "but recognizable" to every prompt
- Use "subtle" and "soft" liberally
- Reference photography, not abstract art
- Lower strength to 0.5-0.6

### **Problem: Color Temperature Shifts**
**Solution:**
- Specify exact color temperature: "warm 3200K lighting"
- Use material references: "honey", "butter", "cream"
- Add "consistent warm tones throughout"

---

## 📊 Quality Checklist

Before deploying a Decart prompt, verify:

- [ ] Contains **3+ "soft/subtle/gentle" modifiers**
- [ ] Specifies **exact lighting quality**
- [ ] Defines **3-5 core colors**
- [ ] Includes **"but recognizable"** or similar anchor
- [ ] References **specific artistic style** (optional but recommended)
- [ ] Sets emotional tone: "calm", "cozy", "inviting"
- [ ] Strength set to **0.5-0.7** range
- [ ] Consistency set to **"high"** or **"very-high"**
- [ ] Tested with **movement** (not just static)
- [ ] No **overly abstract** or **chaotic** words

---

## 🚫 Common Mistakes to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|-------------|
| "Crazy abstract art" | "Subtle impressionist touches" |
| "Extreme colors" | "Muted warm palette" |
| "Transforming constantly" | "Stable, consistent atmosphere" |
| "Wild Van Gogh swirls" | "Gentle Monet-inspired brushstrokes" |
| Just "French bakery" | Full detailed prompt with modifiers |
| Strength 0.9+ | Strength 0.5-0.7 |
| No color anchors | 3-5 specific colors defined |
| Generic "artistic" | Specific artist reference |

---

## 💡 Advanced Techniques

### **Layered Prompts**
Separate concerns for better control:

```javascript
const prompt = [
  // Base atmosphere
  "Soft warm impressionist style",
  
  // Lighting layer
  "gentle golden morning light through lace curtains",
  
  // Texture layer
  "subtle Monet-inspired brushstrokes",
  
  // Color layer
  "creamy beiges and warm honey tones",
  
  // Mood layer
  "cozy intimate Parisian atmosphere",
  
  // Consistency anchors
  "soft focus on edges, painterly but recognizable, calm and inviting"
].join(", ");
```

### **Dynamic Prompts Based on Time/Context**

```javascript
function getMiragePrompt(scenario, timeOfDay, activity) {
  const base = STYLE_PROMPTS[scenario];
  
  const timeModifier = {
    morning: "golden dawn light, fresh and energizing",
    afternoon: "soft natural daylight, relaxed and bright",
    evening: "warm amber glow, intimate and cozy"
  }[timeOfDay];
  
  const activityModifier = {
    conversation: "focused, stable, clear",
    exploration: "atmospheric, gentle depth",
    learning: "bright, crisp, attentive"
  }[activity];
  
  return `${base}, ${timeModifier}, ${activityModifier}`;
}
```

---

## 📝 Testing Protocol

When testing new Decart prompts:

1. **Static Test** - Load scene, observe for 30 seconds
2. **Movement Test** - Walk around, check stability
3. **Interaction Test** - Start conversation, check if still recognizable
4. **Duration Test** - Play for 5+ minutes, watch for drift
5. **Lighting Test** - Check different angles, ensure consistency
6. **User Feedback** - Is it enhancing or distracting?

**Pass Criteria:**
- Scene remains **recognizable** throughout
- Colors stay **consistent** (no wild shifts)
- Movement doesn't cause **flickering**
- User reports it's **enhancing** not distracting
- NPCs and objects remain **identifiable**

---

## 🎯 Example: Before & After

### **❌ Bad Prompt:**
```
"French bakery, artistic, colorful, Van Gogh"
```
**Result:** Chaotic swirls, inconsistent colors, hard to navigate

### **✅ Good Prompt:**
```
"Soft warm impressionist style, gentle golden morning light through lace curtains, subtle Monet-inspired brushstrokes, creamy beiges and warm honey tones, cozy intimate Parisian atmosphere, soft focus on edges, painterly but recognizable, calm and inviting"
```
**Result:** Stable, beautiful, enhances immersion, easy to navigate

---

## 🔮 Future AI Instructions (GPT-5/6)

When working with Decart MirageLSD:

1. **Always prioritize consistency over creativity**
2. **Use this guide's templates as starting points**
3. **Test every prompt with movement, not just statics**
4. **User experience > Visual spectacle**
5. **When in doubt, add more "subtle" modifiers**
6. **Lock color temperature early in the prompt**
7. **Reference photographers more than abstract artists**
8. **Strength 0.6 is the sweet spot for most scenarios**
9. **"But recognizable" is your safety anchor**
10. **Beautiful ≠ Extreme. Subtlety is beautiful.**

---

## 📚 Additional Resources

- **Artist References:** Monet, Renoir, Bonnard, Hopper, Vermeer
- **Color Theory:** Warm (2700-3200K), Neutral (3500-4500K), Cool (5000-6500K)
- **Cinematography:** Roger Deakins, Emmanuel Lubezki (for lighting inspiration)
- **Keywords Library:** soft, gentle, subtle, warm, cozy, intimate, inviting, calm, recognizable, stable, consistent

---

## ✅ Final Reminder

> **"The best Decart effects are the ones users don't consciously notice, but subconsciously feel."**

Your goal is **immersive atmosphere**, not **visual gymnastics**.

Keep it:
- **Soft**
- **Consistent**
- **Recognizable**
- **Beautiful**
- **Functional**

---

**🎨 Now go create beautiful, stable, immersive worlds! 🌍**


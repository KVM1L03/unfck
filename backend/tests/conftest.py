import os

# Provide mock values so Settings() can initialise during import without a real .env.
# In CI these are already set via the workflow env block; this covers local runs.
os.environ.setdefault("SUPABASE_URL", "http://mock-url.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "mock-key")
os.environ.setdefault("OPENAI_API_KEY", "mock-key")

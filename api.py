import fastapi

app = fastapi.FastAPI()

@app.api_route('/health', methods=['GET', 'HEAD'])
@app.api_route('/api/health', methods=['GET', 'HEAD'])
def health():
    return {'status': 'ok'}



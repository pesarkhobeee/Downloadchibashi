# !/bin/bash
find /app/static/downloads/*  -cmin +300  -exec /bin/rm -rf "{}" \;

for i in range(360, 1330, 60):
    small_i = i-40
    print("""
@media (min-width: """+str(i)+"""px) {
    .map-autoscaler{
        width: """+str(small_i)+"""px;
    }
}""")